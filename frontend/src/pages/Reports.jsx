import { useEffect, useState } from 'react';
import { getReports, approveReport } from '../api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatINR = (val) => `₹${Number(val ?? 0).toFixed(2)}`;

  const fetchReports = async () => {
    try {
      const data = await getReports();

      const list = Array.isArray(data) ? data : [];
      setReports([...list].reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleApprove = async (taskId) => {
    try {
      await approveReport(taskId);
      fetchReports();
    } catch (e) {
      console.error("Failed to approve", e);
      alert("Failed to approve report");
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1>Executive Reports</h1>
        <button className="btn btn-secondary">Export All (CSV)</button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ color: 'var(--text-tertiary)' }}>
            No reports generated yet. Go to Analysis to run a workflow.
          </div>
        </div>
      ) : (
        <div className="grid-cards">
          {reports.map((report) => (
            <div
              key={report.task_id}
              className="card"
              style={{
                border:
                  report.status === 'Approved'
                    ? '1px solid var(--success)'
                    : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{report.product_name}</h3>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    ID: {report.product_id}
                  </div>
                </div>

                <span
                  className={`badge ${
                    report.risk_level === 'High'
                      ? 'badge-danger'
                      : report.risk_level === 'Medium'
                      ? 'badge-warning'
                      : 'badge-success'
                  }`}
                >
                  {report.risk_level} Risk
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Current Price
                  </span>
                  <span>{formatINR(report.current_price)}</span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Suggested Price
                  </span>
                  <span
                    style={{
                      color: 'var(--accent-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {formatINR(report.suggested_price)}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    Markdown
                  </span>
                  <span>
                    {report.markdown_percentage?.toFixed(1) ?? '0.0'}%
                  </span>
                </div>

                {report.status && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Status
                    </span>
                    <span
                      style={{
                        color:
                          report.status === 'Approved'
                            ? 'var(--success)'
                            : 'var(--warning)',
                        fontWeight: 'bold',
                      }}
                    >
                      {report.status}
                    </span>
                  </div>
                )}
              </div>

              {report.status !== 'Approved' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => handleApprove(report.task_id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}