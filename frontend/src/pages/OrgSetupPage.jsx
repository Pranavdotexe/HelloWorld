import { useEffect, useState } from 'react';
import { Building2, FolderKanban, PlusCircle, UsersRound } from 'lucide-react';
import {
  createCategory,
  createDepartment,
  getCategories,
  getDepartments,
  getUsers,
  updateUser,
} from '../api/dataApi';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import {
  EmptyState,
  LoadingState,
  PageHeader,
  SearchField,
  StatusPill,
  SurfaceCard,
} from '../components/ui';
=======
import { getDepartments, createDepartment, getCategories, createCategory, getUsers, updateUser } from '../api/dataApi';
import { extractErrorMessage } from '../utils/errorHandler';
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103

const tabs = ['Departments', 'Asset Categories', 'Employee Directory'];

function OrgSetupPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 0) {
        const res = await getDepartments({ limit: 100 });
        setDepartments(res.data.data.departments);
      } else if (activeTab === 1) {
        const res = await getCategories({ limit: 100 });
        setCategories(res.data.data.categories);
      } else {
        const res = await getUsers({ limit: 100, search });
        setUsers(res.data.data.users);
      }
    } catch {
      setDepartments([]);
      setCategories([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [activeTab, search]);

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createDepartment(form);
      setShowForm(false);
      setForm({});
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create department');
    }
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createCategory(form);
      setShowForm(false);
      setForm({});
      loadData();
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Failed to create category');
=======
      setError(extractErrorMessage(err));
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      loadData();
    } catch (err) {
<<<<<<< HEAD
      setError(err.response?.data?.message || 'Failed to update role');
=======
      alert(extractErrorMessage(err));
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
    }
  };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Admin workspace"
        title="Organization setup and master data"
        description="Maintain departments, categories, and employee role assignments without leaving the operational frontend."
        actions={[
          <button key="form" className="button button-primary" onClick={() => setShowForm((value) => !value)}>
            <PlusCircle size={18} />
            <span>{showForm ? 'Close form' : 'Create record'}</span>
          </button>,
        ]}
      />

<<<<<<< HEAD
      <SurfaceCard title="Master data tabs" description="Switch between foundational ERP records." index={0}>
        <div className="page-stack">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((tab, index) => (
              <button key={tab} className={activeTab === index ? 'button button-primary button-sm' : 'button button-secondary button-sm'} onClick={() => { setActiveTab(index); setShowForm(false); }}>
                {tab}
              </button>
=======
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => { setActiveTab(i); setShowForm(false); }}
            style={{ padding: '0.75rem 1.25rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, background: 'none', color: activeTab === i ? 'var(--color-primary)' : 'var(--text-secondary)', borderBottom: activeTab === i ? '2px solid var(--color-primary)' : '2px solid transparent', transition: 'all 0.2s' }}>
            {tab}
          </button>
        ))}
      </div>

      {error && <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.8125rem', marginBottom: '1rem' }}>{error}</div>}

      {/* Department Tab */}
      {activeTab === 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Departments ({departments.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>+ Add Department</button>
          </div>
          {showForm && (
            <form onSubmit={handleCreateDept} className="card" style={{ padding: '1.25rem', marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 1, minWidth: '200px' }} placeholder="Department Name" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="input" style={{ flex: 1, minWidth: '200px' }} placeholder="Description (optional)" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <button type="submit" className="btn btn-primary btn-sm">Create</button>
            </form>
          )}
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {departments.map((dept) => (
              <div key={dept._id} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{dept.name}</div>
                  {dept.description && <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{dept.description}</div>}
                </div>
                <span className={`badge ${dept.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{dept.status}</span>
              </div>
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
            ))}
          </div>

          {error ? <div className="alert">{error}</div> : null}

          {showForm && activeTab === 0 ? (
            <form onSubmit={handleCreateDepartment} style={{ display: 'grid', gap: '1rem', padding: '1.2rem', borderRadius: 22, background: 'rgba(8, 18, 34, 0.54)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="field">
                  <label>Department name</label>
                  <input className="input" value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                </div>
                <div className="field">
                  <label>Description</label>
                  <input className="input" value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </div>
              </div>
              <div><button type="submit" className="button button-primary">Create department</button></div>
            </form>
          ) : null}

<<<<<<< HEAD
          {showForm && activeTab === 1 ? (
            <form onSubmit={handleCreateCategory} style={{ display: 'grid', gap: '1rem', padding: '1.2rem', borderRadius: 22, background: 'rgba(8, 18, 34, 0.54)', border: '1px solid rgba(148, 163, 184, 0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="field">
                  <label>Category name</label>
                  <input className="input" value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                </div>
                <div className="field">
                  <label>Description</label>
                  <input className="input" value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} />
                </div>
              </div>
              <div><button type="submit" className="button button-primary">Create category</button></div>
            </form>
          ) : null}

          {activeTab === 0 ? (
            loading ? (
              <LoadingState label="Loading departments..." />
            ) : departments.length === 0 ? (
              <EmptyState icon={Building2} title="No departments yet" description="Create the organizational structure that assets and employees will roll up into." />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Description</th>
                      <th>Head</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department) => (
                      <tr key={department._id}>
                        <td style={{ fontWeight: 800 }}>{department.name}</td>
                        <td>{department.description || '--'}</td>
                        <td>{department.head?.name || 'Unassigned'}</td>
                        <td><StatusPill>{department.status}</StatusPill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === 1 ? (
            loading ? (
              <LoadingState label="Loading categories..." />
            ) : categories.length === 0 ? (
              <EmptyState icon={FolderKanban} title="No categories yet" description="Create classification layers for electronics, furniture, vehicles, and other tracked assets." />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Custom fields</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td style={{ fontWeight: 800 }}>{category.name}</td>
                        <td>{category.description || '--'}</td>
                        <td>{category.customFields?.length || 0}</td>
                        <td><StatusPill>{category.status}</StatusPill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === 2 ? (
            <div className="page-stack">
              <SearchField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" style={{ maxWidth: 360 }} />
              {loading ? (
                <LoadingState label="Loading employee directory..." />
              ) : users.length === 0 ? (
                <EmptyState icon={UsersRound} title="No users found" description="Employees and promoted roles will appear here once accounts exist." />
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Role assignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((directoryUser) => (
                        <tr key={directoryUser._id}>
                          <td style={{ fontWeight: 800 }}>{directoryUser.name}</td>
                          <td>{directoryUser.email}</td>
                          <td>{directoryUser.department?.name || '--'}</td>
                          <td><StatusPill>{directoryUser.role}</StatusPill></td>
                          <td><StatusPill>{directoryUser.status}</StatusPill></td>
                          <td>
                            {directoryUser.role !== 'Admin' && directoryUser._id !== user._id ? (
                              <select className="select" style={{ minWidth: 170 }} value={directoryUser.role} onChange={(event) => handleRoleChange(directoryUser._id, event.target.value)}>
                                <option value="Employee">Employee</option>
                                <option value="DepartmentHead">Department head</option>
                                <option value="AssetManager">Asset manager</option>
                              </select>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Locked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}
=======
      {/* Employee Tab */}
      {activeTab === 2 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Employees ({users.length})</h2>
            <input className="input" style={{ maxWidth: '300px' }} placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Department</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{u.department?.name || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.role === 'Admin' ? 'badge-danger' : u.role === 'AssetManager' ? 'badge-info' : 'badge-success'}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>{u.status}</span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {u.role !== 'Admin' && u._id !== user._id && (
                        <select className="input" style={{ maxWidth: '160px', padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                          value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                          <option value="Employee">Employee</option>
                          <option value="AssetManager">Asset Mgr</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
>>>>>>> 36d925b87dc35fa31d5d222718b2f5f7754fb103
        </div>
      </SurfaceCard>
    </div>
  );
}

export default OrgSetupPage;
