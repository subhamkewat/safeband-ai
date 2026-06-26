import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Phone, Check, X, ShieldAlert } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import type { EmergencyContact } from '../context/SafetyContext';
import { GlassCard } from '../components/GlassCard';

export const Contacts: React.FC = () => {
  const { contacts, addContact, editContact, deleteContact } = useSafety();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [priorityAlert, setPriorityAlert] = useState(true);

  // Edit states
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRelationship, setEditRelationship] = useState('');
  const [editPriorityAlert, setEditPriorityAlert] = useState(true);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    addContact({ name, phone, relationship, priorityAlert });
    
    // reset form
    setName('');
    setPhone('');
    setRelationship('');
    setPriorityAlert(true);
    setIsAdding(false);
  };

  const handleStartEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditRelationship(contact.relationship);
    setEditPriorityAlert(contact.priorityAlert);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName || !editPhone) return;
    editContact({
      id,
      name: editName,
      phone: editPhone,
      relationship: editRelationship,
      priorityAlert: editPriorityAlert
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Emergency Contacts Manager</h2>
          <p className="text-xs text-gray-400 mt-1">Add priority contacts who will receive your tracked coordinates during an alert.</p>
        </div>
        
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-colors shadow-lg shadow-brand-purple/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Contact
          </button>
        )}
      </div>

      {/* Add New Contact Form Panel */}
      {isAdding && (
        <GlassCard glowColor="purple" className="max-w-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">New Contact Details</h3>
            <button 
              onClick={() => setIsAdding(false)} 
              className="p-1 rounded-lg text-gray-500 hover:text-white"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-white/3 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 012-3456"
                className="w-full bg-white/3 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Relationship</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Father, Spouse, Friend..."
                className="w-full bg-white/3 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple/40"
              />
            </div>

            <div className="flex items-center gap-3 pl-1 h-full pt-4 sm:pt-0">
              <input
                type="checkbox"
                id="priority"
                checked={priorityAlert}
                onChange={(e) => setPriorityAlert(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-white/15 bg-white/5 accent-brand-purple"
              />
              <label htmlFor="priority" className="text-xs text-gray-300 font-semibold cursor-pointer">
                Priority Dispatch Alert (SMS Triggered)
              </label>
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl bg-white/3 hover:bg-white/5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-hover text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </form>
        </GlassCard>
      )}

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <GlassCard 
            key={contact.id} 
            glowColor={contact.priorityAlert ? 'red' : 'none'}
            className="flex flex-col justify-between text-left group"
          >
            {editingId === contact.id ? (
              /* Editing State */
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Relationship</label>
                  <input
                    type="text"
                    value={editRelationship}
                    onChange={(e) => setEditRelationship(e.target.value)}
                    className="w-full bg-white/4 border border-white/8 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                  <input
                    type="checkbox"
                    id={`edit-priority-${contact.id}`}
                    checked={editPriorityAlert}
                    onChange={(e) => setEditPriorityAlert(e.target.checked)}
                    className="accent-brand-purple w-4 h-4"
                  />
                  <label htmlFor={`edit-priority-${contact.id}`} className="text-[11px] text-gray-300 font-bold">
                    Priority Dispatch
                  </label>
                </div>
                
                <div className="flex gap-2 justify-end pt-3 border-t border-white/5">
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg bg-white/3 hover:bg-white/5 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSaveEdit(contact.id)}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Visual State */
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple/20 to-brand-red/5 flex items-center justify-center border border-white/5">
                    <Users className="w-5 h-5 text-brand-purple" />
                  </div>
                  
                  {contact.priorityAlert ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 border border-rose-500/25 text-brand-red uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3 text-brand-red animate-pulse" />
                      Priority SOS
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">{contact.relationship}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-base tracking-wide">{contact.name}</h4>
                  <div className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5">{contact.relationship}</div>
                  
                  <div className="flex items-center gap-2 mt-4 text-xs text-gray-300 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-brand-purple" />
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-white/5 pt-4 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleStartEdit(contact)}
                    className="p-2 rounded-xl bg-white/3 border border-white/5 hover:border-brand-purple/35 text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 rounded-xl bg-white/3 border border-white/5 hover:border-rose-500/35 text-gray-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all cursor-pointer"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </GlassCard>
        ))}
      </div>

    </div>
  );
};
export default Contacts;
