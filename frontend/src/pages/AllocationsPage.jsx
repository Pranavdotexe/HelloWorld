import { useEffect, useMemo, useState } from 'react';
import { ArrowRightLeft, PackageCheck, RefreshCcw, Undo2 } from 'lucide-react';
import {
  approveTransfer,
  createAllocation,
  getAllocations,
  getTransfers,
  rejectTransfer,
  returnAsset,
} from '../api/dataApi';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import {
  EmptyState,
  LoadingState,
  MetricCard,
  PageHeader,
  StatusPill,
  SurfaceCard,
  formatDate,
} from '../components/ui';
=======
import { getAllocations, createAllocation, returnAsset, getOverdueAllocations, getAssets, getUsers, getTransfers, createTransfer, approveTransfer, rejectTransfer } from '../api/dataApi';
import { extractErrorMessage } from '../utils/errorHandler';
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103

const tabs = ['Allocations', 'Transfers'];

function AllocationsPage() {
  const { hasRole } = useAuth();
  const [tab, setTab] = useState(0);
  const [allocations, setAllocations] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [returnForm, setReturnForm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 0) {
        const res = await getAllocations({ limit: 50 });
        setAllocations(res.data.data.allocations);
      } else {
        const res = await getTransfers({ limit: 50 });
        setTransfers(res.data.data.transfers);
      }
    } catch {
      setAllocations([]);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [tab]);

  const handleAllocate = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createAllocation(form);
      setShowForm(false);
      setForm({});
      load();
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Failed to allocate asset');
=======
      setError(extractErrorMessage(err));
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
    }
  };

  const handleReturn = async (event) => {
    event.preventDefault();
    try {
      await returnAsset(returnForm.id, { returnCondition: returnForm.condition, returnNotes: returnForm.notes });
      setReturnForm(null);
      load();
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Failed to process return');
=======
      alert(extractErrorMessage(err));
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
    }
  };

  const handleApproveTransfer = async (id) => {
<<<<<<< HEAD
    try {
      await approveTransfer(id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve transfer');
    }
=======
    try { await approveTransfer(id); load(); } catch (err) { alert(extractErrorMessage(err)); }
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
  };

  const handleRejectTransfer = async (id) => {
    const reason = prompt('Rejection reason:');
<<<<<<< HEAD
    if (!reason) return;
    try {
      await rejectTransfer(id, { rejectionReason: reason });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject transfer');
=======
    if (reason) {
      try { await rejectTransfer(id, { rejectionReason: reason }); load(); } catch (err) { alert(extractErrorMessage(err)); }
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
    }
  };

  const stats = useMemo(() => ({
    active: allocations.filter((item) => item.status === 'Active').length,
    overdue: allocations.filter((item) => item.status === 'Overdue').length,
    requested: transfers.filter((item) => item.status === 'Requested').length,
  }), [allocations, transfers]);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Allocation operations"
        title="Assignment, return, and transfer control"
        description="Keep ownership history clean, prevent double-allocation, and move requests through approval without losing context."
        actions={
          hasRole('Admin', 'AssetManager', 'DepartmentHead') ? [
            <button key="allocate" className="button button-primary" onClick={() => setShowForm((value) => !value)}>
              <PackageCheck size={18} />
              <span>{showForm ? 'Close allocation form' : 'Allocate asset'}</span>
            </button>,
          ] : null
        }
      />

      <section className="kpi-grid">
        <MetricCard title="Active allocations" value={stats.active} icon={PackageCheck} tone="var(--brand-primary)" index={0} footer="Assets currently checked out" />
        <MetricCard title="Overdue returns" value={stats.overdue} icon={Undo2} tone="var(--danger)" index={1} footer="Assignments past expected return date" />
        <MetricCard title="Transfer queue" value={stats.requested} icon={ArrowRightLeft} tone="var(--warning)" index={2} footer="Requests awaiting approval" />
      </section>

<<<<<<< HEAD
      <SurfaceCard title="Workflow board" description="Switch between live allocations and transfer requests." index={0}>
        <div className="page-stack">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((label, index) => (
              <button
                key={label}
                className={tab === index ? 'button button-primary button-sm' : 'button button-secondary button-sm'}
                onClick={() => setTab(index)}
              >
                {label}
              </button>
=======
      {error && <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.8125rem', marginBottom: '1rem' }}>{error}</div>}

      {tab === 0 && (
        <div>
          {hasRole('Admin', 'AssetManager') && (
            <div style={{ marginBottom: '1rem' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>+ Allocate Asset</button>
            </div>
          )}
          {showForm && (
            <form onSubmit={handleAllocate} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label className="label">Asset ID *</label><input className="input" placeholder="Asset ObjectId" value={form.asset || ''} onChange={(e) => setForm({ ...form, asset: e.target.value })} required /></div>
              <div><label className="label">User ID *</label><input className="input" placeholder="User ObjectId" value={form.allocatedTo || ''} onChange={(e) => setForm({ ...form, allocatedTo: e.target.value })} required /></div>
              <div><label className="label">Return Date</label><input className="input" type="date" value={form.expectedReturnDate || ''} onChange={(e) => setForm({ ...form, expectedReturnDate: e.target.value })} /></div>
              <button type="submit" className="btn btn-primary btn-sm">Allocate</button>
            </form>
          )}
          {returnForm && (
            <form onSubmit={handleReturn} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div><label className="label">Return Condition *</label>
                <select className="input" value={returnForm.condition || ''} onChange={(e) => setReturnForm({ ...returnForm, condition: e.target.value })} required>
                  <option value="">Select...</option><option value="Good">Good</option><option value="Fair">Fair</option><option value="Poor">Poor</option><option value="Damaged">Damaged</option>
                </select>
              </div>
              <div><label className="label">Notes</label><input className="input" value={returnForm.notes || ''} onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })} /></div>
              <button type="submit" className="btn btn-success btn-sm">Process Return</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReturnForm(null)}>Cancel</button>
            </form>
          )}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {allocations.map((a) => (
              <div key={a._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{a.asset?.name} ({a.asset?.assetTag})</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>To: {a.allocatedTo?.name} · By: {a.allocatedBy?.name}</div>
                  {a.expectedReturnDate && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Return by: {new Date(a.expectedReturnDate).toLocaleDateString()}</div>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge ${statusBadge[a.status]}`}>{a.status}</span>
                  {a.status === 'Active' && hasRole('Admin', 'AssetManager') && (
                    <button className="btn btn-sm btn-secondary" onClick={() => setReturnForm({ id: a._id, condition: '', notes: '' })}>Return</button>
                  )}
                </div>
              </div>
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
            ))}
          </div>

          {error ? <div className="alert">{error}</div> : null}

          {showForm && tab === 0 ? (
            <form onSubmit={handleAllocate} style={{ display: 'grid', gap: '1rem', padding: '1.2rem', borderRadius: 22, background: 'rgba(8, 18, 34, 0.54)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="field">
                  <label>Asset ID</label>
                  <input className="input" value={form.asset || ''} onChange={(event) => setForm({ ...form, asset: event.target.value })} required />
                </div>
                <div className="field">
                  <label>User ID</label>
                  <input className="input" value={form.allocatedTo || ''} onChange={(event) => setForm({ ...form, allocatedTo: event.target.value })} required />
                </div>
                <div className="field">
                  <label>Expected return date</label>
                  <input className="input" type="date" value={form.expectedReturnDate || ''} onChange={(event) => setForm({ ...form, expectedReturnDate: event.target.value })} />
                </div>
              </div>
<<<<<<< HEAD
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="submit" className="button button-primary">Confirm allocation</button>
                <button type="button" className="button button-secondary" onClick={() => setShowForm(false)}>Cancel</button>
=======
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className={`badge ${statusBadge[t.status]}`}>{t.status}</span>
                {t.status === 'Requested' && hasRole('Admin', 'AssetManager') && (
                  <>
                    <button className="btn btn-sm btn-success" onClick={() => handleApproveTransfer(t._id)}>Approve</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleRejectTransfer(t._id)}>Reject</button>
                  </>
                )}
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
              </div>
            </form>
          ) : null}

          {returnForm ? (
            <form onSubmit={handleReturn} style={{ display: 'grid', gap: '1rem', padding: '1.2rem', borderRadius: 22, background: 'rgba(8, 18, 34, 0.54)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="field">
                  <label>Return condition</label>
                  <select className="select" value={returnForm.condition || ''} onChange={(event) => setReturnForm({ ...returnForm, condition: event.target.value })} required>
                    <option value="">Select condition</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
                <div className="field">
                  <label>Check-in notes</label>
                  <input className="input" value={returnForm.notes || ''} onChange={(event) => setReturnForm({ ...returnForm, notes: event.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="submit" className="button button-success">Process return</button>
                <button type="button" className="button button-secondary" onClick={() => setReturnForm(null)}>Cancel</button>
              </div>
            </form>
          ) : null}

          {loading ? (
            <LoadingState label="Loading allocation workflow..." />
          ) : tab === 0 ? (
            allocations.length === 0 ? (
              <EmptyState icon={PackageCheck} title="No allocations yet" description="Assigned assets will appear here with return commitments and current holders." />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Assigned to</th>
                      <th>Assigned by</th>
                      <th>Return target</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((allocation) => (
                      <tr key={allocation._id}>
                        <td>
                          <div style={{ fontWeight: 800 }}>{allocation.asset?.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{allocation.asset?.assetTag}</div>
                        </td>
                        <td>{allocation.allocatedTo?.name || '--'}</td>
                        <td>{allocation.allocatedBy?.name || '--'}</td>
                        <td>{formatDate(allocation.expectedReturnDate)}</td>
                        <td><StatusPill>{allocation.status}</StatusPill></td>
                        <td>
                          {allocation.status === 'Active' && hasRole('Admin', 'AssetManager') ? (
                            <button className="button button-secondary button-sm" onClick={() => setReturnForm({ id: allocation._id, condition: '', notes: '' })}>
                              <RefreshCcw size={14} />
                              <span>Return</span>
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : transfers.length === 0 ? (
            <EmptyState icon={ArrowRightLeft} title="No transfer requests" description="Requests created to resolve allocation conflicts will appear here for approval or rejection." />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Requested by</th>
                    <th>Current holder</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => (
                    <tr key={transfer._id}>
                      <td>
                        <div style={{ fontWeight: 800 }}>{transfer.asset?.name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{transfer.asset?.assetTag}</div>
                      </td>
                      <td>{transfer.requestedBy?.name || '--'}</td>
                      <td>{transfer.currentHolder?.name || '--'}</td>
                      <td style={{ maxWidth: 260, color: 'var(--text-secondary)' }}>{transfer.reason || 'No reason provided'}</td>
                      <td><StatusPill>{transfer.status}</StatusPill></td>
                      <td>
                        {transfer.status === 'Requested' && hasRole('Admin', 'AssetManager', 'DepartmentHead') ? (
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <button className="button button-success button-sm" onClick={() => handleApproveTransfer(transfer._id)}>Approve</button>
                            <button className="button button-danger button-sm" onClick={() => handleRejectTransfer(transfer._id)}>Reject</button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Already processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </SurfaceCard>

      <style>{`
        @media (max-width: 1200px) {
          .kpi-grid > * { grid-column: span 4 !important; }
        }
        @media (max-width: 780px) {
          .kpi-grid > * { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
}

export default AllocationsPage;
