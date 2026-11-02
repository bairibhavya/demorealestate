
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Users,
  Pencil,
  UserRoundCheck,
  UserRoundX,
  Camera,
  X,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  CalendarDays,
  ImagePlus,
} from "lucide-react";
import toast from "react-hot-toast";

import { supabase } from "../../../services/supabase";
import {
  fetchEmployees,
  photoSignedUrl,
  formatDate,
} from "../../../services/crm";
import { useAuth } from "../../../context/AuthContext";

import "./EmployeesModal.css";

const emptyForm = {
  full_name: "",
  phone: "",
  email: "",
  designation: "Sales Executive",
  department: "Sales",
  joined_on: "",
  address: "",
  role: "employee",
  is_active: true,
};

export default function Employees() {
  const { role } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [photos, setPhotos] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("active");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load employees from the database
  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchEmployees();
      setEmployees(data || []);

      const photoEntries = await Promise.all(
        (data || [])
          .filter((employee) => employee.photo_path)
          .map(async (employee) => {
            try {
              const url = await photoSignedUrl(employee.photo_path);
              return [employee.id, url];
            } catch {
              return [employee.id, null];
            }
          })
      );

      setPhotos(Object.fromEntries(photoEntries));
    } catch (error) {
      toast.error(error.message || "Unable to load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Close the popup with Escape and prevent background scrolling
  useEffect(() => {
    if (!editing) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onEscape(event) {
      if (event.key === "Escape" && !saving) {
        setEditing(null);
      }
    }

    document.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [editing, saving]);

  // Employee search and filtering
  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim();

    return employees.filter((employee) => {
      const matchesStatus =
        filter === "all" ||
        (filter === "active"
          ? employee.is_active
          : !employee.is_active);

      const searchableFields = [
        employee.full_name,
        employee.employee_code,
        employee.phone,
        employee.email,
        employee.designation,
        employee.department,
      ];

      const matchesSearch = searchableFields.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );

      return matchesStatus && matchesSearch;
    });
  }, [employees, search, filter]);

  const activeCount = employees.filter(
    (employee) => employee.is_active
  ).length;

  const linkedCount = employees.filter(
    (employee) => employee.auth_user_id && employee.is_active
  ).length;

  // Open New Employee form
  function addEmployee() {
    setEditing({});
    setForm({ ...emptyForm });
    setPhotoFile(null);
  }

  // Open Edit Employee form
  function editEmployee(employee) {
    setEditing(employee);

    setForm({
      full_name: employee.full_name || "",
      phone: employee.phone || "",
      email: employee.email || "",
      designation: employee.designation || "",
      department: employee.department || "",
      joined_on: employee.joined_on || "",
      address: employee.address || "",
      role: employee.role || "employee",
      is_active: employee.is_active ?? true,
    });

    setPhotoFile(null);
  }

  function closeModal() {
    if (!saving) {
      setEditing(null);
      setPhotoFile(null);
    }
  }

  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Save employee
  async function handleSave(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);

      const name = form.full_name.trim();
      const phone = form.phone.trim();

      if (name.length < 2) {
        throw new Error("Please enter the employee's full name");
      }

      if (!/^\+?[\d ()-]{8,18}$/.test(phone)) {
        throw new Error("Please enter a valid phone number");
      }

      if (photoFile) {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
        ];

        if (!validTypes.includes(photoFile.type)) {
          throw new Error("Only JPG, PNG and WebP photos are allowed");
        }

        if (photoFile.size > 5 * 1024 * 1024) {
          throw new Error("Employee photo cannot exceed 5 MB");
        }
      }

      const payload = {
        full_name: name,
        phone,
        email: form.email.trim() || null,
        designation: form.designation.trim() || "Sales Executive",
        department: form.department.trim() || "Sales",
        joined_on: form.joined_on || null,
        address: form.address.trim() || null,
        is_active: Boolean(form.is_active),

        role:
          role === "admin"
            ? form.role
            : editing?.id
            ? editing.role
            : "employee",

        // Preserve existing account associations.
        // New employees are registered without requiring a UUID.
        auth_user_id: editing?.auth_user_id || null,
      };

      let result;

      if (editing?.id) {
        const { data, error } = await supabase
          .from("crm_employees")
          .update(payload)
          .eq("id", editing.id)
          .select("id,employee_code")
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("crm_employees")
          .insert(payload)
          .select("id,employee_code")
          .single();

        if (error) throw error;
        result = data;
      }

      // Employee photo upload
      if (photoFile) {
        try {
          const extension =
            photoFile.type === "image/png"
              ? "png"
              : photoFile.type === "image/webp"
              ? "webp"
              : "jpg";

          const filePath =
            `${result.id}/${crypto.randomUUID()}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from("crm-employee-photos")
            .upload(filePath, photoFile, {
              contentType: photoFile.type,
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { error: updateError } = await supabase
            .from("crm_employees")
            .update({ photo_path: filePath })
            .eq("id", result.id);

          if (updateError) throw updateError;
        } catch (photoError) {
          toast.error(
            `Employee saved, but photo upload failed: ${photoError.message}`
          );
        }
      }

      toast.success(
        `${result.employee_code || "Employee"} saved successfully`
      );

      closeModal();
      await loadEmployees();
    } catch (error) {
      console.error("Employee save error:", error);

      toast.error(error.message || "Unable to save employee");
    } finally {
      setSaving(false);
    }
  }

  // Activate or deactivate employee
  async function toggleEmployee(employee) {
    const nextStatus = !employee.is_active;

    const confirmed = window.confirm(
      `${nextStatus ? "Activate" : "Deactivate"} ${employee.full_name}?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("crm_employees")
        .update({ is_active: nextStatus })
        .eq("id", employee.id);

      if (error) throw error;

      toast.success("Employee status updated");
      await loadEmployees();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="employees-page">
      {/* Page heading */}
      <header className="employees-heading">
        <div>
          <span className="employees-eyebrow">
            <Users size={15} />
            TEAM MANAGEMENT
          </span>

          <h1>Employees</h1>

          <p>
            Register employees, manage profiles and track your team.
          </p>
        </div>

        <button
          type="button"
          className="employees-primary-button"
          onClick={addEmployee}
        >
          <Plus size={18} />
          Register Employee
        </button>
      </header>

      {/* Statistics */}
      <div className="employees-stats">
        <div className="employees-stat-card">
          <span className="employees-stat-icon">
            <Users size={20} />
          </span>

          <strong>{employees.length}</strong>
          <p>Total Employees</p>
        </div>

        <div className="employees-stat-card">
          <span className="employees-stat-icon">
            <UserRoundCheck size={20} />
          </span>

          <strong>{activeCount}</strong>
          <p>Active Employees</p>
        </div>

        <div className="employees-stat-card">
          <span className="employees-stat-icon">
            <ShieldCheck size={20} />
          </span>

          <strong>{linkedCount}</strong>
          <p>Login Enabled</p>
        </div>
      </div>

      {/* Search toolbar */}
      <div className="employees-toolbar">
        <label className="employees-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search employee name, ID, mobile..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter employees by status"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="active">Active Employees</option>
          <option value="inactive">Inactive Employees</option>
          <option value="all">All Employees</option>
        </select>
      </div>

      {/* Employee list */}
      {loading ? (
        <div className="employees-empty">
          Loading employees...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="employees-empty">
          <Users size={30} />

          <h3>No employees found</h3>

          <p>
            Register your first employee or change your search filters.
          </p>
        </div>
      ) : (
        <div className="employees-grid">
          {filteredEmployees.map((employee, index) => (
            <motion.article
              key={employee.id}
              className="employee-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.28,
                delay: Math.min(index, 5) * 0.04,
              }}
            >
              <div className="employee-card-top">
                {photos[employee.id] ? (
                  <img
                    className="employee-avatar"
                    src={photos[employee.id]}
                    alt=""
                  />
                ) : (
                  <div className="employee-avatar employee-avatar-fallback">
                    {employee.full_name?.charAt(0).toUpperCase() || "E"}
                  </div>
                )}

                <div className="employee-card-identity">
                  <h3>{employee.full_name}</h3>
                  <span>{employee.employee_code}</span>
                </div>

                <span
                  className={
                    employee.is_active
                      ? "employee-status active"
                      : "employee-status inactive"
                  }
                >
                  {employee.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="employee-card-content">
                <strong>{employee.designation}</strong>

                <span>{employee.department}</span>

                <p>
                  <Phone size={15} />
                  {employee.phone}
                </p>

                {employee.email && (
                  <p>
                    <Mail size={15} />
                    {employee.email}
                  </p>
                )}

                <p>
                  <CalendarDays size={15} />
                  Joined: {formatDate(employee.joined_on)}
                </p>

                <p>
                  <ShieldCheck size={15} />
                  {employee.auth_user_id
                    ? "Login enabled"
                    : "Employee record only"}
                </p>
              </div>

              <div className="employee-card-actions">
                <button
                  type="button"
                  onClick={() => editEmployee(employee)}
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => toggleEmployee(employee)}
                >
                  {employee.is_active ? (
                    <UserRoundX size={16} />
                  ) : (
                    <UserRoundCheck size={16} />
                  )}

                  {employee.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Employee Registration Popup */}
      {editing &&
        createPortal(
          <div
            className="emp-modal-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              className="emp-modal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="employee-modal-title"
            >
              {/* Popup heading */}
              <div className="emp-modal-heading">
                <div>
                  <span className="emp-modal-kicker">
                    EMPLOYEE MANAGEMENT
                  </span>

                  <h2 id="employee-modal-title">
                    {editing.id
                      ? "Edit Employee"
                      : "Register Employee"}
                  </h2>

                  <p>
                    {editing.id
                      ? `Employee ID: ${editing.employee_code}`
                      : "Employee ID will be assigned automatically."}
                  </p>
                </div>

                <button
                  type="button"
                  className="emp-modal-close"
                  aria-label="Close registration"
                  onClick={closeModal}
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              <form className="emp-modal-form" onSubmit={handleSave}>
                {/* Scrollable form */}
                <div className="emp-modal-body">
                  <div className="emp-modal-grid">
                    <label>
                      Full Name *
                      <input
                        required
                        minLength={2}
                        placeholder="Employee full name"
                        value={form.full_name}
                        onChange={(event) =>
                          updateForm("full_name", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Phone Number *
                      <input
                        required
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={form.phone}
                        onChange={(event) =>
                          updateForm("phone", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Email Address
                      <input
                        type="email"
                        placeholder="employee@example.com"
                        value={form.email}
                        onChange={(event) =>
                          updateForm("email", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Designation
                      <input
                        placeholder="Sales Executive"
                        value={form.designation}
                        onChange={(event) =>
                          updateForm("designation", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Department
                      <input
                        placeholder="Sales"
                        value={form.department}
                        onChange={(event) =>
                          updateForm("department", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Joining Date
                      <input
                        type="date"
                        value={form.joined_on}
                        onChange={(event) =>
                          updateForm("joined_on", event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Employee Role
                      <select
                        disabled={role !== "admin"}
                        value={form.role}
                        onChange={(event) =>
                          updateForm("role", event.target.value)
                        }
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        {form.role === "admin" && (
                          <option value="admin">Administrator</option>
                        )}
                      </select>
                    </label>

                    <label>
                      Employee Photo
                      <span className="emp-photo-input">
                        <ImagePlus size={17} />

                        <span>
                          {photoFile
                            ? photoFile.name
                            : "Choose employee photo"}
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) =>
                            setPhotoFile(event.target.files?.[0] || null)
                          }
                        />
                      </span>
                      <small>JPG, PNG or WebP · Maximum 5 MB</small>
                    </label>

                    <label className="emp-modal-wide">
                      Address
                      <textarea
                        rows={2}
                        placeholder="Employee address"
                        value={form.address}
                        onChange={(event) =>
                          updateForm("address", event.target.value)
                        }
                      />
                    </label>

                    <label className="emp-modal-check emp-modal-wide">
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(event) =>
                          updateForm("is_active", event.target.checked)
                        }
                      />

                      <span>Employee is active</span>
                    </label>
                  </div>
                </div>

                {/* Fixed action buttons */}
                <div className="emp-modal-actions">
                  <button
                    type="button"
                    className="emp-cancel"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="emp-save"
                    disabled={saving}
                  >
                    <CheckCircle2 size={17} />
                    {saving ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
