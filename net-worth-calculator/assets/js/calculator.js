// Net Worth Calculator Application
class NetWorthCalculator {
    constructor() {
        this.data = {
            assets: {},
            liabilities: {}
        };

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

        this.charts = {};
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.setupEventListeners();
        this.renderCategories();
        this.updateCalculations();
    }

    setupEventListeners() {
        document.getElementById('addAssetBtn').addEventListener('click', () => this.openAddModal('assets'));
        document.getElementById('addLiabilityBtn').addEventListener('click', () => this.openAddModal('liabilities'));
        document.getElementById('exportPdfBtn').addEventListener('click', () => this.exportPDF());
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCSV());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetCalculator());
        document.getElementById('saveItemBtn').addEventListener('click', () => this.saveItem());

        // Event delegation for category add buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nwc-add-category')) {
                const type = e.target.dataset.type;
                const category = e.target.dataset.category;
                this.quickAddItem(type, category);
            }
            if (e.target.classList.contains('nwc-item-delete')) {
                const type = e.target.dataset.type;
                const category = e.target.dataset.category;
                const index = parseInt(e.target.dataset.index);
                this.deleteItem(type, category, index);
            }
        });
    }

    renderCategories() {
        this.renderAssetCategories();
        this.renderLiabilityCategories();
    }

    renderAssetCategories() {
        const container = document.getElementById('assetsCategories');
        container.innerHTML = '';

        if (Object.keys(this.data.assets).length === 0) {
            Object.keys(this.assetCategories).forEach(key => {
                this.data.assets[key] = [];
            });
        }

        Object.entries(this.assetCategories).forEach(([key, config]) => {
            const items = this.data.assets[key] || [];
            const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const html = this.createCategoryHTML(key, config, items, total, 'assets');
            container.innerHTML += html;
        });
    }

    renderLiabilityCategories() {
        const container = document.getElementById('liabilitiesCategories');
        container.innerHTML = '';

        if (Object.keys(this.data.liabilities).length === 0) {
            Object.keys(this.liabilityCategories).forEach(key => {
                this.data.liabilities[key] = [];
            });
        }

        Object.entries(this.liabilityCategories).forEach(([key, config]) => {
            const items = this.data.liabilities[key] || [];
            const total = items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            const html = this.createCategoryHTML(key, config, items, total, 'liabilities');
            container.innerHTML += html;
        });
    }

    createCategoryHTML(key, config, items, total, type) {
        const hasItems = items.length > 0;
        const itemsHTML = items.map((item, idx) => `
            <li class="nwc-item">
                <span class="nwc-item-name">${item.name}</span>
                <span class="nwc-item-amount">$${this.formatNumber(item.amount)}</span>
                <button class="nwc-item-delete" data-type="${type}" data-category="${key}" data-index="${idx}">
                    ×
                </button>
            </li>
        `).join('');

        return `
            <div class="nwc-category" data-category="${key}">
                <div class="nwc-category-title">
                    ${config.icon} ${config.label}
                    ${hasItems ? `<span class="nwc-category-total">${type === 'assets' ? '+' : ''}$${this.formatNumber(total)}</span>` : ''}
                </div>
                ${items.length > 0 ? `<ul class="nwc-items-list">${itemsHTML}</ul>` : '<p style="color: #9ca3af; margin: 0; font-size: 0.9rem;">No items added</p>'}
                <button class="btn btn-sm btn-outline-secondary mt-2 w-100 nwc-add-category" data-type="${type}" data-category="${key}">
                    Add ${config.label}
                </button>
            </div>
        `;
    }

    quickAddItem(type, category) {
        this.currentItemType = type;
        this.currentItemCategory = category;
        this.openAddModal(type, category);
    }

    openAddModal(type, category = null) {
        this.currentItemType = type;
        this.currentItemCategory = category;

        try {
            const modalEl = document.getElementById('categoryModal');
            if (!modalEl) {
                console.error('Modal element not found');
                return;
            }

            const title = type === 'assets' ? 'Add New Asset' : 'Add New Liability';
            document.getElementById('categoryModalLabel').textContent = title;

            const categorySelect = document.getElementById('itemCategory');
            const categories = type === 'assets' ? this.assetCategories : this.liabilityCategories;

            categorySelect.innerHTML = Object.entries(categories).map(([key, config]) =>
                `<option value="${key}" ${category === key ? 'selected' : ''}>${config.icon} ${config.label}</option>`
            ).join('');

            document.getElementById('itemName').value = '';
            document.getElementById('itemAmount').value = '';

            // Show modal
            const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
            modal.show();
        } catch (e) {
            console.error('Error opening modal:', e);
            this.showNotification('Error opening form', 'error');
        }
    }

    saveItem() {
        const name = document.getElementById('itemName').value.trim();
        const amount = parseFloat(document.getElementById('itemAmount').value) || 0;
        const category = document.getElementById('itemCategory').value;

        if (!name) {
            this.showNotification('Please enter a name', 'error');
            return;
        }

        if (amount <= 0) {
            this.showNotification('Amount must be greater than 0', 'error');
            return;
        }

        const type = this.currentItemType;
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;

        if (!dataType[category]) {
            dataType[category] = [];
        }

        dataType[category].push({ name, amount });
        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.showNotification(`${name} added successfully!`, 'success');

        bootstrap.Modal.getInstance(document.getElementById('categoryModal')).hide();
    }

    deleteItem(type, category, index) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        const item = dataType[category][index];

        dataType[category].splice(index, 1);
        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.showNotification(`${item.name} deleted`, 'success');
    }

    updateCalculations() {
        const totalAssets = this.calculateTotal('assets');
        const totalLiabilities = this.calculateTotal('liabilities');
        const netWorth = totalAssets - totalLiabilities;

        // Update totals
        document.getElementById('assetsTotal').textContent = '$' + this.formatNumber(totalAssets);
        document.getElementById('liabilitiesTotal').textContent = '$' + this.formatNumber(totalLiabilities);
        document.getElementById('summaryAssets').textContent = '$' + this.formatNumber(totalAssets);
        document.getElementById('summaryLiabilities').textContent = '$' + this.formatNumber(totalLiabilities);
        document.getElementById('summaryNetWorth').textContent = '$' + this.formatNumber(netWorth);

        // Update summary card color
        const summaryCard = document.querySelector('.nwc-summary-card');
        if (netWorth < 0) {
            summaryCard.parentElement.classList.add('nwc-networth-negative');
        } else {
            summaryCard.parentElement.classList.remove('nwc-networth-negative');
        }

        // Update charts
        this.updateCharts(totalAssets, totalLiabilities, netWorth);
    }

    calculateTotal(type) {
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        return Object.values(dataType).reduce((sum, items) =>
            sum + items.reduce((itemSum, item) => itemSum + parseFloat(item.amount || 0), 0), 0
        );
    }

    updateCharts(totalAssets, totalLiabilities, netWorth) {
        // Breakdown Chart
        this.createOrUpdateChart('breakdownChart', {
            type: 'doughnut',
            data: {
                labels: ['Total Assets', 'Total Liabilities'],
                datasets: [{
                    data: [totalAssets, totalLiabilities],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderColor: ['#059669', '#dc2626'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });

        // Assets by Category
        const assetCategoryData = this.getChartData('assets');
        if (assetCategoryData.labels.length > 0) {
            this.createOrUpdateChart('assetsChart', {
                type: 'bar',
                data: {
                    labels: assetCategoryData.labels,
                    datasets: [{
                        label: 'Amount ($)',
                        data: assetCategoryData.values,
                        backgroundColor: '#3b82f6',
                        borderColor: '#1e40af',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }

        // Liabilities by Category
        const liabilityCategoryData = this.getChartData('liabilities');
        if (liabilityCategoryData.labels.length > 0) {
            this.createOrUpdateChart('liabilitiesChart', {
                type: 'bar',
                data: {
                    labels: liabilityCategoryData.labels,
                    datasets: [{
                        label: 'Amount ($)',
                        data: liabilityCategoryData.values,
                        backgroundColor: '#ef4444',
                        borderColor: '#dc2626',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    getChartData(type) {
        const categories = type === 'assets' ? this.assetCategories : this.liabilityCategories;
        const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
        const labels = [];
        const values = [];

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

    createOrUpdateChart(canvasId, config) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, config);
    }

    exportPDF() {
        const element = document.querySelector('.nwc-container');
        const opt = {
            margin: 10,
            filename: 'net-worth-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
        };

        html2pdf().set(opt).from(element).save();
        this.showNotification('PDF exported successfully!', 'success');
    }

    exportCSV() {
        let csv = 'Net Worth Calculator Report\n';
        csv += 'Generated on: ' + new Date().toLocaleDateString() + '\n\n';

        csv += 'ASSETS\n';
        csv += 'Category,Item,Amount\n';
        Object.entries(this.data.assets).forEach(([category, items]) => {
            items.forEach(item => {
                csv += `${this.assetCategories[category].label},${item.name},${item.amount}\n`;
            });
        });

        const totalAssets = this.calculateTotal('assets');
        csv += `TOTAL ASSETS,,$${totalAssets}\n\n`;

        csv += 'LIABILITIES\n';
        csv += 'Category,Item,Amount\n';
        Object.entries(this.data.liabilities).forEach(([category, items]) => {
            items.forEach(item => {
                csv += `${this.liabilityCategories[category].label},${item.name},${item.amount}\n`;
            });
        });

        const totalLiabilities = this.calculateTotal('liabilities');
        csv += `TOTAL LIABILITIES,,$${totalLiabilities}\n`;
        csv += `NET WORTH,,$${totalAssets - totalLiabilities}\n`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'net-worth-report.csv';
        a.click();

        this.showNotification('CSV exported successfully!', 'success');
    }

    resetCalculator() {
        if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) return;

        this.data = {
            assets: {},
            liabilities: {}
        };

        this.saveToStorage();
        this.renderCategories();
        this.updateCalculations();
        this.showNotification('Calculator has been reset', 'success');
    }

    formatNumber(num) {
        return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('nwc-notification');
        notification.textContent = message;
        notification.className = `nwc-notification show ${type}`;

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    saveToStorage() {
        localStorage.setItem('nwc-data', JSON.stringify(this.data));
    }

    loadFromStorage() {
        const stored = localStorage.getItem('nwc-data');
        if (stored) {
            this.data = JSON.parse(stored);
        }
    }
}

// Initialize on page load
let calculator;
document.addEventListener('DOMContentLoaded', () => {
    calculator = new NetWorthCalculator();
});
