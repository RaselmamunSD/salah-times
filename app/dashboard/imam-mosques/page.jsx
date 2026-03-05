"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { useAuth } from "../../providers/AuthProvider";
import { useAxios } from "../../providers/AxiosProvider";
import { mosqueService } from "../../services/mosque";

const emptyMosqueForm = {
    name: "",
    contact_person: "",
    city: "",
    address: "",
    phone: "",
    email: "",
};

const emptyTimetableForm = {
    day: "",
    fajr_adhan: "",
    fajr_iqamah: "",
    sunrise: "",
    dhuhr_adhan: "",
    dhuhr_iqamah: "",
    asr_adhan: "",
    asr_iqamah: "",
    maghrib_adhan: "",
    maghrib_iqamah: "",
    isha_adhan: "",
    isha_iqamah: "",
};

function ImamMosquesPageContent() {
    const { user } = useAuth();
    const axios = useAxios();
    const isImam = Boolean(user?.is_imam || user?.user_type === "imam");

    const [mosques, setMosques] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [savingMosque, setSavingMosque] = useState(false);
    const [message, setMessage] = useState("");

    const [editingMosqueId, setEditingMosqueId] = useState(null);
    const [mosqueForm, setMosqueForm] = useState(emptyMosqueForm);

    const [selectedMosqueId, setSelectedMosqueId] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [timetableRows, setTimetableRows] = useState([]);
    const [timetableForm, setTimetableForm] = useState(emptyTimetableForm);
    const [savingTimetable, setSavingTimetable] = useState(false);

    const selectedMosque = useMemo(
        () => mosques.find((mosque) => mosque.id === selectedMosqueId),
        [mosques, selectedMosqueId]
    );

    const loadCities = useCallback(async () => {
        try {
            const response = await axios.get("/api/locations/cities/", {
                params: { is_active: true },
            });
            const items = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.results)
                    ? response.data.results
                    : [];
            setCities(items);
        } catch (error) {
            setCities([]);
        }
    }, [axios]);

    const loadImamMosques = useCallback(async () => {
        setLoading(true);
        try {
            const response = await mosqueService.getImamMosques();
            const items = Array.isArray(response) ? response : [];
            setMosques(items);
            if (items.length > 0 && !selectedMosqueId) {
                setSelectedMosqueId(items[0].id);
            }
        } catch (error) {
            setMosques([]);
        } finally {
            setLoading(false);
        }
    }, [selectedMosqueId]);

    const loadTimetable = useCallback(async (mosqueId) => {
        if (!mosqueId) {
            setTimetableRows([]);
            return;
        }
        try {
            const response = await mosqueService.getMonthlyTimetable(mosqueId, { month, year });
            setTimetableRows(Array.isArray(response) ? response : []);
        } catch {
            setTimetableRows([]);
        }
    }, [month, year]);

    useEffect(() => {
        if (!isImam) return;
        loadCities();
        loadImamMosques();
    }, [isImam, loadCities, loadImamMosques]);

    useEffect(() => {
        if (!isImam) return;
        loadTimetable(selectedMosqueId);
    }, [isImam, selectedMosqueId, month, year, loadTimetable]);

    const handleMosqueFormChange = (field) => (event) => {
        setMosqueForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleTimetableFormChange = (field) => (event) => {
        setTimetableForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const startEditMosque = (mosque) => {
        setEditingMosqueId(mosque.id);
        setMosqueForm({
            name: mosque.name || "",
            contact_person: mosque.contact_person || "",
            city: mosque.city ? String(mosque.city) : "",
            address: mosque.address || "",
            phone: mosque.phone || "",
            email: mosque.email || "",
        });
    };

    const resetMosqueForm = () => {
        setEditingMosqueId(null);
        setMosqueForm(emptyMosqueForm);
    };

    const submitMosque = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!mosqueForm.name || !mosqueForm.city || !mosqueForm.address) {
            setMessage("Mosque name, city and address are required.");
            return;
        }

        setSavingMosque(true);
        try {
            const payload = {
                ...mosqueForm,
                city: Number(mosqueForm.city),
            };

            if (editingMosqueId) {
                await mosqueService.updateImamMosque(editingMosqueId, payload);
                setMessage("Mosque updated successfully.");
            } else {
                await mosqueService.createImamMosque(payload);
                setMessage("Mosque created successfully.");
            }

            resetMosqueForm();
            await loadImamMosques();
        } catch (error) {
            setMessage(error?.response?.data?.detail || "Failed to save mosque.");
        } finally {
            setSavingMosque(false);
        }
    };

    const deleteMosque = async (mosqueId) => {
        const confirmDelete = window.confirm("Delete this mosque?");
        if (!confirmDelete) return;

        setMessage("");
        try {
            await mosqueService.deleteImamMosque(mosqueId);
            if (selectedMosqueId === mosqueId) {
                setSelectedMosqueId(null);
            }
            setMessage("Mosque deleted successfully.");
            await loadImamMosques();
        } catch (error) {
            setMessage(error?.response?.data?.detail || "Failed to delete mosque.");
        }
    };

    const submitTimetableEntry = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!selectedMosqueId) {
            setMessage("Please select a mosque first.");
            return;
        }

        if (!timetableForm.day) {
            setMessage("Day is required for monthly timetable.");
            return;
        }

        setSavingTimetable(true);
        try {
            await mosqueService.saveImamMonthlyTimetable(selectedMosqueId, {
                year: Number(year),
                month: Number(month),
                entries: [
                    {
                        day: Number(timetableForm.day),
                        fajr_adhan: timetableForm.fajr_adhan,
                        fajr_iqamah: timetableForm.fajr_iqamah,
                        sunrise: timetableForm.sunrise || null,
                        dhuhr_adhan: timetableForm.dhuhr_adhan,
                        dhuhr_iqamah: timetableForm.dhuhr_iqamah,
                        asr_adhan: timetableForm.asr_adhan,
                        asr_iqamah: timetableForm.asr_iqamah,
                        maghrib_adhan: timetableForm.maghrib_adhan,
                        maghrib_iqamah: timetableForm.maghrib_iqamah,
                        isha_adhan: timetableForm.isha_adhan,
                        isha_iqamah: timetableForm.isha_iqamah,
                    },
                ],
            });

            setTimetableForm(emptyTimetableForm);
            setMessage("Monthly timetable entry saved.");
            await loadTimetable(selectedMosqueId);
        } catch (error) {
            setMessage(error?.response?.data?.detail || "Failed to save timetable entry.");
        } finally {
            setSavingTimetable(false);
        }
    };

    const saveFullMonthTimetable = async () => {
        setMessage("");

        if (!selectedMosqueId) {
            setMessage("Please select a mosque first.");
            return;
        }

        const requiredFields = [
            "fajr_adhan",
            "fajr_iqamah",
            "dhuhr_adhan",
            "dhuhr_iqamah",
            "asr_adhan",
            "asr_iqamah",
            "maghrib_adhan",
            "maghrib_iqamah",
            "isha_adhan",
            "isha_iqamah",
        ];

        const hasMissing = requiredFields.some((field) => !timetableForm[field]);
        if (hasMissing) {
            setMessage("Please set all prayer adhan/iqamah times before saving full month.");
            return;
        }

        const daysInMonth = new Date(Number(year), Number(month), 0).getDate();
        const entries = Array.from({ length: daysInMonth }, (_, index) => ({
            day: index + 1,
            fajr_adhan: timetableForm.fajr_adhan,
            fajr_iqamah: timetableForm.fajr_iqamah,
            sunrise: timetableForm.sunrise || null,
            dhuhr_adhan: timetableForm.dhuhr_adhan,
            dhuhr_iqamah: timetableForm.dhuhr_iqamah,
            asr_adhan: timetableForm.asr_adhan,
            asr_iqamah: timetableForm.asr_iqamah,
            maghrib_adhan: timetableForm.maghrib_adhan,
            maghrib_iqamah: timetableForm.maghrib_iqamah,
            isha_adhan: timetableForm.isha_adhan,
            isha_iqamah: timetableForm.isha_iqamah,
        }));

        setSavingTimetable(true);
        try {
            await mosqueService.saveImamMonthlyTimetable(selectedMosqueId, {
                year: Number(year),
                month: Number(month),
                entries,
            });
            setMessage(`Full month timetable saved for ${daysInMonth} days.`);
            await loadTimetable(selectedMosqueId);
        } catch (error) {
            setMessage(error?.response?.data?.detail || "Failed to save full month timetable.");
        } finally {
            setSavingTimetable(false);
        }
    };

    const deleteTimetableEntry = async (day) => {
        if (!selectedMosqueId) return;
        if (!window.confirm(`Delete timetable entry for day ${day}?`)) return;

        setMessage("");
        try {
            await mosqueService.deleteImamMonthlyTimetable(selectedMosqueId, {
                year: Number(year),
                month: Number(month),
                days: [Number(day)]
            });
            setMessage("Timetable entry deleted.");
            await loadTimetable(selectedMosqueId);
        } catch (error) {
            setMessage(error?.response?.data?.detail || "Failed to delete timetable entry.");
        }
    };

    if (!isImam) {
        return (
            <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl border border-gray-100 text-slate-700">
                This page is only available for Imam accounts.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-[#1E293B]">Register Your Mosque</h1>
                <p className="text-sm text-slate-500 mt-1">Add, edit and delete only your mosque data.</p>
            </div>

            {message && (
                <div className="bg-[#E9F3EE] border border-[#BEE5CC] text-[#1E6B46] px-4 py-3 rounded-xl text-sm">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">
                        {editingMosqueId ? "Edit Mosque" : "Add Mosque"}
                    </h2>

                    <form onSubmit={submitMosque} className="space-y-4">
                        {/* Basic Information Section */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Basic Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Mosque Name *</label>
                                    <input
                                        value={mosqueForm.name}
                                        onChange={handleMosqueFormChange("name")}
                                        placeholder="e.g., Central Mosque, Al-Noor Mosque"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Full Address *</label>
                                    <textarea
                                        value={mosqueForm.address}
                                        onChange={handleMosqueFormChange("address")}
                                        placeholder="e.g., House #123, Road #45, Residential Area, Nearby landmark"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Area / District *</label>
                                    <select
                                        value={mosqueForm.city}
                                        onChange={handleMosqueFormChange("city")}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value="">Select Area / District</option>
                                        {cities.map((city) => (
                                            <option key={city.id} value={city.id}>{city.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Contact Person</label>
                                    <input
                                        value={mosqueForm.contact_person}
                                        onChange={handleMosqueFormChange("contact_person")}
                                        placeholder="e.g., Abdul Hamid Imam"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                                    <input
                                        value={mosqueForm.phone}
                                        onChange={handleMosqueFormChange("phone")}
                                        placeholder="e.g., +880123456789"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={mosqueForm.email}
                                        onChange={handleMosqueFormChange("email")}
                                        placeholder="e.g., info@mosque.com"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2 border-t border-gray-200">
                            <button type="submit" disabled={savingMosque} className="bg-[#238B57] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                                {savingMosque ? "Saving..." : editingMosqueId ? "Update Mosque" : "Create Mosque"}
                            </button>
                            {editingMosqueId && (
                                <button type="button" onClick={resetMosqueForm} className="border border-gray-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium">
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Mosques</h2>
                    {loading && <p className="text-sm text-slate-500">Loading...</p>}
                    {!loading && mosques.length === 0 && (
                        <p className="text-sm text-slate-500">No mosque found. Create your first mosque.</p>
                    )}

                    <div className="space-y-3">
                        {mosques.map((mosque) => (
                            <div key={mosque.id} className={`border rounded-xl p-4 ${selectedMosqueId === mosque.id ? "border-[#238B57] bg-[#F0F9F5]" : "border-gray-200 hover:border-gray-300"} transition-colors`}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMosqueId(mosque.id)}
                                    className="text-left w-full"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 text-sm">{mosque.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                <span className="inline-block">📍 {mosque.city_name || 'N/A'}</span>
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mosque.address}</p>
                                            {mosque.phone && <p className="text-xs text-slate-500 mt-1">📞 {mosque.phone}</p>}
                                            {mosque.email && <p className="text-xs text-slate-500">📧 {mosque.email}</p>}
                                        </div>
                                    </div>
                                    {mosque.primary_image_url && (
                                        <div className="mt-3">
                                            <img
                                                src={mosque.primary_image_url}
                                                alt="Mosque"
                                                className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </button>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => startEditMosque(mosque)} className="flex-1 text-xs px-3 py-2 rounded bg-[#EEF7FB] text-[#1F6F8B] font-medium hover:bg-[#E0EDFA]">✏️ Edit</button>
                                    <button onClick={() => deleteMosque(mosque.id)} className="flex-1 text-xs px-3 py-2 rounded bg-red-50 text-red-600 font-medium hover:bg-red-100">🗑️ Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Monthly Prayer Timetable</h2>
                <p className="text-sm text-slate-500 mb-4">
                    {selectedMosque ? `Selected Mosque: ${selectedMosque.name}` : "Select a mosque to manage timetable."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Year" />
                    <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Month" />
                    <input type="number" min={1} max={31} value={timetableForm.day} onChange={handleTimetableFormChange("day")} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Day" />
                </div>

                <form onSubmit={submitTimetableEntry} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    <input type="time" value={timetableForm.fajr_adhan} onChange={handleTimetableFormChange("fajr_adhan")} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Fajr Adhan" />
                    <input type="time" value={timetableForm.fajr_iqamah} onChange={handleTimetableFormChange("fajr_iqamah")} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Fajr Iqamah" />
                    <input type="time" value={timetableForm.sunrise} onChange={handleTimetableFormChange("sunrise")} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Sunrise (Optional)" />
                    <input type="time" value={timetableForm.dhuhr_adhan} onChange={handleTimetableFormChange("dhuhr_adhan")} className="border border-gray-200 rounded-lg px-3 py-2" placeholder="Dhuhr Adhan" />
                    <input type="time" value={timetableForm.dhuhr_iqamah} onChange={handleTimetableFormChange("dhuhr_iqamah")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.asr_adhan} onChange={handleTimetableFormChange("asr_adhan")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.asr_iqamah} onChange={handleTimetableFormChange("asr_iqamah")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.maghrib_adhan} onChange={handleTimetableFormChange("maghrib_adhan")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.maghrib_iqamah} onChange={handleTimetableFormChange("maghrib_iqamah")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.isha_adhan} onChange={handleTimetableFormChange("isha_adhan")} className="border border-gray-200 rounded-lg px-3 py-2" />
                    <input type="time" value={timetableForm.isha_iqamah} onChange={handleTimetableFormChange("isha_iqamah")} className="border border-gray-200 rounded-lg px-3 py-2" />

                    <button type="submit" disabled={savingTimetable} className="md:col-span-5 bg-[#238B57] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                        {savingTimetable ? "Saving timetable..." : "Save Timetable Entry"}
                    </button>
                    <button
                        type="button"
                        disabled={savingTimetable}
                        onClick={saveFullMonthTimetable}
                        className="md:col-span-5 border border-[#238B57] text-[#238B57] px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                        {savingTimetable ? "Saving timetable..." : "Save Full Month (1-last day)"}
                    </button>
                </form>

                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F8FAFC] text-slate-700">
                            <tr>
                                <th className="text-left px-3 py-2">Day</th>
                                <th className="text-left px-3 py-2">Fajr</th>
                                <th className="text-left px-3 py-2">Sunrise</th>
                                <th className="text-left px-3 py-2">Dhuhr</th>
                                <th className="text-left px-3 py-2">Asr</th>
                                <th className="text-left px-3 py-2">Maghrib</th>
                                <th className="text-left px-3 py-2">Isha</th>
                                <th className="text-left px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timetableRows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-4 text-slate-500">No timetable entry for selected month.</td>
                                </tr>
                            )}
                            {timetableRows.map((row) => (
                                <tr key={row.id} className="border-t border-gray-100">
                                    <td className="px-3 py-2">{row.day}</td>
                                    <td className="px-3 py-2">{row.fajr_adhan} / {row.fajr_iqamah}</td>
                                    <td className="px-3 py-2">{row.sunrise || '-'}</td>
                                    <td className="px-3 py-2">{row.dhuhr_adhan} / {row.dhuhr_iqamah}</td>
                                    <td className="px-3 py-2">{row.asr_adhan} / {row.asr_iqamah}</td>
                                    <td className="px-3 py-2">{row.maghrib_adhan} / {row.maghrib_iqamah}</td>
                                    <td className="px-3 py-2">{row.isha_adhan} / {row.isha_iqamah}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => deleteTimetableEntry(row.day)}
                                            className="text-xs px-2 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function ImamMosquesPage() {
    return (
        <ProtectedRoute>
            <ImamMosquesPageContent />
        </ProtectedRoute>
    );
}
