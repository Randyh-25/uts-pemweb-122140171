const HistoryTable = ({ history, onCityClick, onClear }) => {
  if (!history || history.length === 0) {
    return (
      <div className="history-section">
        <h3>Search History</h3>
        <p className="no-history">No search history yet</p>
      </div>
    );
  }

  return (
    <div className="history-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Search History</h3>
        <button className="view-btn" onClick={onClear}>Clear history</button>
      </div>
      <div className="table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Date</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr key={index}>
                <td>{item.city}</td>
                <td>{new Date(item.timestamp).toLocaleDateString()}</td>
                <td>{new Date(item.timestamp).toLocaleTimeString()}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => onCityClick(item.city)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
