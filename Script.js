// Full product list including beers, jeera, and Bitting Special
const products = [
  { name: "Kingfisher Beer", price: 200 },
  { name: "Tuborg Beer",   price: 200 },
  { name: "Jeera Full",     price: 60  },
  { name: "Jeera Half",     price: 30  },
  { name: "RC Full",        price: 250 },
  { name: "RC Half",        price: 130 },
  { name: "RH Full",        price: 250 },
  { name: "RH Half",        price: 130 },
  { name: "OC Blue Full",   price: 220 },
  { name: "OC Blue Half",   price: 110 },
  { name: "No.1 Full",      price: 220 },
  { name: "No.1 Half",      price: 110 },
  { name: "Desi Full",      price: 100 },
  { name: "Desi Half",      price: 50  },
  { name: "Water 1L",       price: 20  },
  { name: "Water 500ml",    price: 10  },
  { name: "Sting",          price: 20  },
  { name: "Orange",         price: 20  },
  { name: "Jeera",          price: 20  },
  { name: "Sprite",         price: 20  },
  { name: "Thumbs Up",      price: 20  },
  { name: "Soda",           price: 20  },
  { name: "Maza",           price: 20  },
  { name: "Lassi",          price: 30  },
  { name: "Paneer Masala",      price: 150 },
  { name: "Misal",               price: 100 },
  { name: "Kaju Masala",         price: 150 },
  { name: "Doodh Shev Bhaji",    price: 120 },
  { name: "Shev Bhaji",          price: 100 },
  { name: "Dal Tadka",           price: 120 },
  { name: "Boil Egg",            price: 20  },
  { name: "Fried Omelette",      price: 60  },
  { name: "Anda Curry",          price: 100 },
  { name: "Chicken Ourself",     price: 600 },
  { name: "Chicken Theirself",   price: 200 },
  { name: "Mutton Ourself",      price: 600 },
  { name: "Mutton Theirself",    price: 200 },
  // Bitting Special (Full / Half)
  { name: "Salty Peanut Full",   price: 10 },
  { name: "Salty Peanut Half",   price: 5  },
  { name: "Roasted Peanut Full", price: 10 },
  { name: "Roasted Peanut Half", price: 5  },
  { name: "Red Peas Full",       price: 10 },
  { name: "Red Peas Half",       price: 5  },
  { name: "Potato Chilli Wafer Full", price: 10 },
  { name: "Potato Chilli Wafer Half", price: 5  },
  { name: "Nimbu Chana Full",    price: 10 },
  { name: "Nimbu Chana Half",    price: 5  },
  { name: "Haldi Chana Full",    price: 10 },
  { name: "Haldi Chana Half",    price: 5  },
  { name: "Moong Dal Full",      price: 10 },
  { name: "Moong Dal Half",      price: 5  },
  { name: "Cigrate Goldflake",      price: 15 },
  { name: "Cigrate Indimint ",      price: 15  }
];

const searchBox      = document.getElementById("searchBox");
const dropdown       = document.getElementById("productDropdown");
const billsContainer = document.getElementById("billsContainer");

// Holds data and element refs per table
let bills = {};

// Live-filter the dropdown
function filterProducts() {
  const term = searchBox.value.toLowerCase();
  dropdown.innerHTML = `<option value="">-- Select Product --</option>`;
  products
    .filter(p => p.name.toLowerCase().includes(term))
    .forEach(p => {
      const o = document.createElement("option");
      o.value = p.name;
      o.text  = `${p.name} – ₹${p.price}`;
      dropdown.append(o);
    });
}

function selectProduct() {
  searchBox.value = dropdown.value;
}

// Build a new bill section
function createBillSection(tableNo) {
  const sec = document.createElement("div");
  sec.className = "bill";
  sec.id = `bill-${tableNo}`;
  sec.innerHTML = `
    <h3>Table ${tableNo}</h3>
    <table>
      <thead>
        <tr>
          <th>Sr No</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Price (₹)</th>
          <th>Amount (₹)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div class="total">Total: ₹<span>0</span></div>
    <button class="print-btn" onclick="printBill('${tableNo}')">Print Bill</button>
    <button class="clear-btn" onclick="clearBill('${tableNo}')">Clear Bill</button>
  `;
  billsContainer.append(sec);

  const tbody   = sec.querySelector("tbody");
  const totalEl = sec.querySelector(".total span");
  bills[tableNo] = { count: 0, total: 0, tbodyEl: tbody, totalEl, containerEl: sec };
}

// Add item to current table's bill
function addToBill() {
  const tableNo = document.getElementById("tableNumber").value.trim();
  const prod    = dropdown.value;
  const qty     = parseFloat(document.getElementById("quantity").value);

  if (!tableNo)      return alert("Please enter a Table No.");
  if (!prod)         return alert("Please select a product.");
  if (!qty || qty<=0) return alert("Enter a valid quantity.");

  if (!bills[tableNo]) createBillSection(tableNo);

  const bill  = bills[tableNo];
  const price = products.find(p => p.name === prod).price;
  const amt   = price * qty;

  bill.count++;
  bill.total += amt;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${bill.count}</td>
    <td>${prod}</td>
    <td>${qty}</td>
    <td>${price}</td>
    <td>${amt.toFixed(2)}</td>
    <td>
      <button class="clear-item-btn"
              onclick="removeItem(this,'${tableNo}')">
        Remove
      </button>
    </td>
  `;
  bill.tbodyEl.append(row);
  bill.totalEl.textContent = bill.total.toFixed(2);

  // Reset selectors
  searchBox.value = "";
  dropdown.innerHTML = `<option value="">-- Select Product --</option>`;
  document.getElementById("quantity").value = 1;
}

// Remove a single item row
function removeItem(btn, tableNo) {
  const bill = bills[tableNo];
  if (!bill) return;

  const tr      = btn.closest('tr');
  const amtCell = tr.children[4];
  const amt     = parseFloat(amtCell.textContent) || 0;

  // Update total & remove row
  bill.total -= amt;
  bill.totalEl.textContent = bill.total.toFixed(2);
  tr.remove();

  // Re-number Sr No and update count
  const rows = bill.tbodyEl.querySelectorAll('tr');
  bill.count = rows.length;
  rows.forEach((r, i) => r.children[0].textContent = i+1);
}

// Clear entire bill for a table
function clearBill(tableNo) {
  const bill = bills[tableNo];
  if (!bill) return;
  bill.count = 0;
  bill.total = 0;
  bill.tbodyEl.innerHTML = "";
  bill.totalEl.textContent = "0";
}

// Print only that table's section
function printBill(tableNo) {
  document.querySelectorAll(".print-area")
    .forEach(el => el.classList.remove("print-area"));
  bills[tableNo].containerEl.classList.add("print-area");
  window.print();
}