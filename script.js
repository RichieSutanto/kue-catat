const form = document.getElementById('transaction-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const list = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const editList = document.getElementById('edit-list');

// Section elements
const sections = {
  home: document.getElementById('home-section'),
  history: document.getElementById('history-section'),
  edit: document.getElementById('edit-section'),
};

// Navbar links
document.getElementById('nav-home').addEventListener('click', () => showSection('home'));
document.getElementById('nav-history').addEventListener('click', () => showSection('history'));
document.getElementById('nav-edit').addEventListener('click', () => showSection('edit'));

// Toggle active navbar and sections
function showSection(section) {
  for (const key in sections) {
    sections[key].classList.add('hidden');
    document.getElementById(`nav-${key}`).classList.remove('active');
  }
  sections[section].classList.remove('hidden');
  document.getElementById(`nav-${section}`).classList.add('active');
}

// Transactions array from localStorage
let transactions = JSON.parse(localStorage.getItem('keucatat-data')) || [];

// Render transactions for History and Edit sections, update summary
function renderTransactions() {
  list.innerHTML = '';
  editList.innerHTML = '';

  let income = 0, expense = 0;

  transactions.forEach((tx, index) => {
    // History list item
    const li = document.createElement('li');
    li.classList.add(tx.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${tx.description} <span>Rp ${tx.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${index})">x</button>
    `;
    list.appendChild(li);

    // Edit list item
    const editLi = document.createElement('li');
    editLi.innerHTML = `
      <input type="text" value="${tx.description}" id="edit-desc-${index}" />
      <input type="number" value="${tx.amount}" id="edit-amt-${index}" />
      <div class="edit-actions">
        <button class="save-btn" onclick="saveEdit(${index})">Simpan</button>
        <button class="cancel-btn" onclick="renderTransactions()">Batal</button>
      </div>
    `;
    editList.appendChild(editLi);

    // Calculate totals
    if (tx.amount > 0) income += tx.amount;
    else expense += Math.abs(tx.amount);
  });

  const balance = income - expense;
  balanceEl.textContent = balance;
  incomeEl.textContent = `Rp ${income}`;
  expenseEl.textContent = `Rp ${expense}`;
}

// Add new transaction
function addTransaction(e) {
  e.preventDefault();

  const description = descInput.value.trim();
  const amount = +amountInput.value;

  if (description === '' || isNaN(amount)) return;

  transactions.push({ description, amount });
  localStorage.setItem('keucatat-data', JSON.stringify(transactions));
  
  descInput.value = '';
  amountInput.value = '';
  renderTransactions();
}

// Delete transaction by index
function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem('keucatat-data', JSON.stringify(transactions));
  renderTransactions();
}

// Save edited transaction
function saveEdit(index) {
  const newDesc = document.getElementById(`edit-desc-${index}`).value.trim();
  const newAmt = +document.getElementById(`edit-amt-${index}`).value;

  if (newDesc === '' || isNaN(newAmt)) return;

  transactions[index] = { description: newDesc, amount: newAmt };
  localStorage.setItem('keucatat-data', JSON.stringify(transactions));
  renderTransactions();
}

// Navbar active link highlight on click
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.navbar a').forEach(el => el.classList.remove('active'));
    link.classList.add('active');
  });
});

// Event listener untuk form submit
form.addEventListener('submit', addTransaction);

// Render awal data
renderTransactions();
