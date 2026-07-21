class NetWorthCalculator {
    constructor() {
        this.data = { assets: {}, liabilities: {} };
        this.assetCategories = {
            'cash': { label: 'Cash', icon: '💵' },
            'savings': { label: 'Savings Account', icon: '🏦' },
            'checking': { label: 'Checking Account', icon: '💳' },
            'investments': { label: 'Investments (Stocks/Bonds)', icon: '📈' },
            'retirement': { label: 'Retirement Accounts (401k/IRA)', icon: '🎯' },
            'real_estate': { label: 'Real Estate', icon: '🏠' },
            'vehicles': { label: 'Vehicles', icon: '🚗' },
            'cryptocurrency': { label: 'Cryptocurrency', icon: '₿' },
            'other_assets': { label: 'Other Assets', icon: '📦' }
        };
        this.liabilityCategories = {
            'mortgage': { label: 'Mortgage', icon: '🏠' },
            'home_equity': { label: 'Home Equity Loan', icon: '🏡' },
            'auto_loan': { label: 'Auto Loan', icon: '🚗' },
            'student_loan': { label: 'Student Loan', icon: '📚' },
            'credit_card': { label: 'Credit Card Debt', icon: '💳' },
            'personal_loan': { label: 'Personal Loan', icon: '💰' },
            'medical': { label: 'Medical Debt', icon: '🏥' },
            'other_liabilities': { label: 'Other Debts', icon: '📋' }
        };
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderCategories();
        this.updateCalculations();
    }

    setupEventListeners() {
        document.getElementById('addAssetBtn').addEventListener('click', () => this.openModal('assets'));
        document.getElementById('addLiabilityBtn').addEventListener('click', () => this.openModal('liabilities'));
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportPDF());
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCSV());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCalculator());
        document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelModalBtn').addEventListener('click', () => this.closeModal());

        // Close on overlay click
        const overlay = document.getElementById('nwc-modal-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeModal();
        });

        // Enter key to submit
        document.getElementById('itemAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveItem();
        });

        // Category buttons and delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nwc-add-category')) {
                const type = e.target.dataset.type;
                const category = e.target.dataset.category;
                this.openModal(type, category);
            }
            if (e.target.classList.contains('nwc-item-delete')) {
                const type = e.target.dataset.type;
                const category = e.target.dataset.category;
                const index = parseInt(e.target.dataset.index);
                this.deleteItem(type, category, index);
            }
        });
    }

    openModal(type, category = null) {
        this.currentType = type;
        this.currentCategory = category;

        const title = type === 'assets' ? 'Add New Asset' : 'Add New Liability';
        document.getElementById('categoryModalLabel').textContent = title;

        const categorySelect = document.getElementById('itemCategory');
        const categories = type === 'assets' ? this.assetCategories : this.liabilityCategories;
        
        categorySelect.innerHTML = Object.entries(categories).map(([key, config]) =>
            `<option value="${key}" ${category === key ? 'selected' : ''}>${config.icon} ${config.label}</option>`
        ).join('');

        document.getElementById('itemName').value = '';
        document.getElementById('itemAmount').value = '';

        document.getElementById('nwc-modal-overlay').classList.add('show');
        document.getElementById('itemName').focus();
    }

    closeModal() {
        document.getElementById('nwc-modal-overlay').classList.remove('show');
    }

    saveItem() {
        const name = document.getElementById('itemName').value.trim();
        const amount = parseFloat(document.getElementById('itemAmount').value) || 0;
        const category = document.getElementById('itemCategory').value;

        if (!name) {
            alert('Please enter an item name');
            return;
        }

        if (amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        const dataType = this.currentType === 'assets' ? this.data.assets : this.data.liabilities;
        if (!dataType[category]) dataType[category] = [];
        
        dataType[category].push({ name, amount });
        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.closeModal();
        this.showNotification(`${name} added!`, 'success');
    }

    deleteItem(type, category, index) {
        if (!confirm('Delete this item?')) return;
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        const item = dataType[category][index];
        dataType[category].splice(index, 1);
        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.showNotification(`${item.name} deleted`, 'success');
    }

    renderCategories() {
        this.renderAssets();
        this.renderLiabilities();
    }

    renderAssets() {
        const container = document.getElementById('assetsCategories');
        container.innerHTML = '';
        if (!Object.keys(this.data.assets).length) {
            Object.keys(this.assetCategories).forEach(key => { this.data.assets[key] = []; });
        }
        Object.entries(this.assetCategories).forEach(([key, config]) => {
            const items = this.data.assets[key] || [];
            const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            container.innerHTML += this.getCategoryHTML(key, config, items, total, 'assets');
        });
    }

    renderLiabilities() {
        const container = document.getElementById('liabilitiesCategories');
        container.innerHTML = '';
        if (!Object.keys(this.data.liabilities).length) {
            Object.keys(this.liabilityCategories).forEach(key => { this.data.liabilities[key] = []; });
        }
        Object.entries(this.liabilityCategories).forEach(([key, config]) => {
            const items = this.data.liabilities[key] || [];
            const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            container.innerHTML += this.getCategoryHTML(key, config, items, total, 'liabilities');
        });
    }

    getCategoryHTML(key, config, items, total, type) {
        const itemsHTML = items.map((item, idx) => `
            <li class="nwc-item">
                <span class="nwc-item-name">${item.name}</span>
                <span class="nwc-item-amount">$${this.formatNumber(item.amount)}</span>
                <button class="nwc-item-delete" data-type="${type}" data-category="${key}" data-index="${idx}">×</button>
            </li>
        `).join('');

        return `
            <div class="nwc-category" data-category="${key}">
                <div class="nwc-category-title">
                    ${config.icon} ${config.label}
                    ${items.length > 0 ? `<span class="nwc-category-total">$${this.formatNumber(total)}</span>` : ''}
                </div>
                ${items.length > 0 ? `<ul class="nwc-items-list">${itemsHTML}</ul>` : '<p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">No items added</p>'}
                <button class="btn btn-sm btn-outline-secondary mt-2 w-100 nwc-add-category" data-type="${type}" data-category="${key}">
                    Add ${config.label}
                </button>
            </div>
        `;
    }

    updateCalculations() {
        const totalAssets = this.getTotal('assets');
        const totalLiabilities = this.getTotal('liabilities');
        const netWorth = totalAssets - totalLiabilities;

        document.getElementById('assetsTotal').textContent = '$' + this.formatNumber(totalAssets);
        document.getElementById('liabilitiesTotal').textContent = '$' + this.formatNumber(totalLiabilities);
        document.getElementById('summaryAssets').textContent = '$' + this.formatNumber(totalAssets);
        document.getElementById('summaryLiabilities').textContent = '$' + this.formatNumber(totalLiabilities);
        document.getElementById('summaryNetWorth').textContent = '$' + this.formatNumber(netWorth);

        this.updateCharts(totalAssets, totalLiabilities);
    }

    getTotal(type) {
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        return Object.values(dataType).reduce((sum, items) =>
            sum + items.reduce((itemSum, item) => itemSum + parseFloat(item.amount || 0), 0), 0
        );
    }

    updateCharts(totalAssets, totalLiabilities) {
        if (!window.Chart) return;

        // Breakdown Chart
        this.updateChart('breakdownChart', {
            type: 'doughnut',
            data: {
                labels: ['Total Assets', 'Total Liabilities'],
                datasets: [{
                    data: [totalAssets, totalLiabilities],
                    backgroundColor: ['#10b981', '#D81E3A'],
                    borderColor: ['#059669', '#A01529'],
                    borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
        });

        // Assets Chart
        const assetData = this.getChartData('assets');
        if (assetData.labels.length > 0) {
            this.updateChart('assetsChart', {
                type: 'bar',
                data: {
                    labels: assetData.labels,
                    datasets: [{ label: 'Amount ($)', data: assetData.values, backgroundColor: '#D81E3A', borderColor: '#A01529', borderWidth: 1 }]
                },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => '$' + v.toLocaleString() } } } }
            });
        }

        // Liabilities Chart
        const liabData = this.getChartData('liabilities');
        if (liabData.labels.length > 0) {
            this.updateChart('liabilitiesChart', {
                type: 'bar',
                data: {
                    labels: liabData.labels,
                    datasets: [{ label: 'Amount ($)', data: liabData.values, backgroundColor: '#D81E3A', borderColor: '#A01529', borderWidth: 1 }]
                },
                options: { indexAxis: 'y', responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { callback: v => '$' + v.toLocaleString() } } } }
            });
        }
    }

    getChartData(type) {
        const categories = type === 'assets' ? this.assetCategories : this.liabilityCategories;
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        const labels = [], values = [];
        
        Object.entries(categories).forEach(([key, config]) => {
            const items = dataType[key] || [];
            const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            if (total > 0) {
                labels.push(config.label);
                values.push(total);
            }
        });
        return { labels, values };
    }

    updateChart(canvasId, config) {
        if (window.nwcCharts && window.nwcCharts[canvasId]) {
            window.nwcCharts[canvasId].destroy();
        }
        if (!window.nwcCharts) window.nwcCharts = {};
        const ctx = document.getElementById(canvasId).getContext('2d');
        window.nwcCharts[canvasId] = new Chart(ctx, config);
    }

    exportPDF() {
        if (!window.html2pdf) { alert('PDF export not available'); return; }
        const element = document.querySelector('.nwc-container');
        html2pdf().set({ margin: 10, filename: 'net-worth-report.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' } }).from(element).save();
    }

    exportCSV() {
        let csv = 'Net Worth Calculator Report\nGenerated: ' + new Date().toLocaleDateString() + '\n\nASSETS\nCategory,Item,Amount\n';
        Object.entries(this.data.assets).forEach(([cat, items]) => {
            items.forEach(item => csv += `${this.assetCategories[cat].label},${item.name},${item.amount}\n`);
        });
        csv += `TOTAL ASSETS,,${this.getTotal('assets')}\n\nLIABILITIES\nCategory,Item,Amount\n`;
        Object.entries(this.data.liabilities).forEach(([cat, items]) => {
            items.forEach(item => csv += `${this.liabilityCategories[cat].label},${item.name},${item.amount}\n`);
        });
        csv += `TOTAL LIABILITIES,,${this.getTotal('liabilities')}\nNET WORTH,,${this.getTotal('assets') - this.getTotal('liabilities')}\n`;
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'net-worth-report.csv';
        a.click();
    }

    resetCalculator() {
        if (!confirm('Reset all data? This cannot be undone.')) return;
        this.data = { assets: {}, liabilities: {} };
        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.showNotification('Calculator reset', 'success');
    }

    formatNumber(num) {
        return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('nwc-notification');
        notification.textContent = message;
        notification.className = `nwc-notification show ${type}`;
        setTimeout(() => notification.classList.remove('show'), 3000);
    }

    saveToStorage() {
        localStorage.setItem('nwc-data', JSON.stringify(this.data));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('nwc-data');
        if (stored) this.data = JSON.parse(stored);
    }
}

let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new NetWorthCalculator();
});
