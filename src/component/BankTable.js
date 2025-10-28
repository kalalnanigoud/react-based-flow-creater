import React, { useState } from "react";

const BankTable = () => {
  const [banks, setBanks] = useState([
    { id: "37EC48A3A8E214E7E0630DF73E0AA4F3", number: "●●●●●●●●●●●●5622", enrolled: true },
    { id: "42296F2AB4A31C3EE0630CF73E0A3221", number: "●●●●●●●●●●●●2100", enrolled: false },
  ]);

  const addBank = () => {
    const newBankId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const newNumber = "●●●●●●●●●●●●" + Math.floor(1000 + Math.random() * 9000);
    setBanks([...banks, { id: newBankId, number: newNumber, enrolled: false }]);
  };

  return (
    <div>
      <button onClick={addBank} style={{ marginBottom: "20px" }}>
        Add Bank
      </button>

      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "700px" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left", padding: "8px" }}>Bank</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr key={bank.id} className={`common-datatable-v2__row row-${bank.id}`}>
              <td className="common-datatable-v2__cell cell-paymentmethod" style={{ padding: "8px" }}>
                <span className="payment-method-v2__container">
                  <span className="payment-method-v2__card-number">
                    <img
                      className="payment-method-v2__card-ach"
                      height="20px"
                      alt="Bank"
                      style={{ marginRight: "10px" }}
                    />
                    {bank.number}
                  </span>
                </span>
              </td>
              <td className="common-datatable-v2__cell cell-actions" style={{ padding: "8px" }}>
                <button
                  className="menu-inline__action-buttons"
                  aria-label={`Bank ${bank.number.slice(-4)} Edit`}
                  onClick={() => alert(`Editing bank ${bank.number.slice(-4)}`)}
                >
                  Edit
                </button>
                <button
                  className="menu-inline__action-buttons"
                  aria-label={`Bank ${bank.number.slice(-4)} ${
                    bank.enrolled ? "Unenroll" : "Remove"
                  }`}
                  onClick={() => alert(`Removing bank ${bank.number.slice(-4)}`)}
                >
                  {bank.enrolled ? "Unenroll" : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankTable;
