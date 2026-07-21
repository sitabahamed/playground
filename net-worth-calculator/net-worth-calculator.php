<?php
/**
 * Plugin Name: Net Worth Calculator
 * Description: A professional net worth calculator with Minted Moola branding
 * Version: 2.0.0
 * Author: Your Name
 * License: GPL2
 */

if (!defined('ABSPATH')) exit;

define('NWC_VERSION', '2.0.0');
define('NWC_PLUGIN_URL', plugin_dir_url(__FILE__));

// Enqueue styles and scripts
function nwc_enqueue_assets() {
    // Bootstrap CSS
    wp_enqueue_style('nwc-bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css', array(), '5.3.0');

    // Chart.js
    wp_enqueue_script('nwc-charts', 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js', array(), '4.4.0', true);

    // HTML2PDF for export
    wp_enqueue_script('nwc-html2pdf', 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js', array(), '0.10.1', true);

    // Custom CSS
    wp_enqueue_style('nwc-style', NWC_PLUGIN_URL . 'assets/css/calculator.css', array(), NWC_VERSION);

    // Custom JS - loaded in footer
    wp_enqueue_script('nwc-app', NWC_PLUGIN_URL . 'assets/js/calculator.js', array('jquery'), NWC_VERSION, true);
}
add_action('wp_enqueue_scripts', 'nwc_enqueue_assets');

// Shortcode
function nwc_calculator_shortcode() {
    ob_start();
    ?>
    <div class="nwc-calculator-wrapper">
        <div class="container-fluid">
            <div class="nwc-header">
                <div class="nwc-brand-label">MINTED MOOLA</div>
                <h1 class="nwc-title">
                    <span class="nwc-icon">💰</span> Net Worth Calculator
                </h1>
                <p class="nwc-subtitle">Fame. Fortune. The Full Story.</p>
            </div>

            <div class="nwc-container">
                <!-- Quick Add Form -->
                <div class="nwc-quick-add-section" id="quickAddForm" style="display:none;">
                    <div class="nwc-quick-add-header">
                        <h3 id="formTitle">Add New Item</h3>
                        <button class="nwc-quick-add-close" onclick="window.nwcApp.closeForm()">×</button>
                    </div>
                    <div class="nwc-quick-add-body">
                        <div class="nwc-form-group">
                            <label>Item Name</label>
                            <input type="text" class="nwc-form-input" id="itemName" placeholder="e.g., Savings Account">
                        </div>
                        <div class="nwc-form-group">
                            <label>Amount ($)</label>
                            <input type="number" class="nwc-form-input" id="itemAmount" placeholder="0.00" step="0.01" min="0">
                        </div>
                        <div class="nwc-form-group">
                            <label>Category</label>
                            <select class="nwc-form-input" id="itemCategory"></select>
                        </div>
                        <div class="nwc-form-group">
                            <button class="btn btn-primary w-100" onclick="window.nwcApp.saveItem()">Save Item</button>
                            <button class="btn btn-secondary w-100 mt-2" onclick="window.nwcApp.closeForm()">Cancel</button>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <!-- Left Column -->
                    <div class="col-lg-6">
                        <div class="nwc-section nwc-assets-section">
                            <div class="nwc-section-header">
                                <h2><span class="nwc-badge">📈</span> Assets</h2>
                                <span class="nwc-section-total" id="assetsTotal">$0.00</span>
                            </div>
                            <div id="assetsContainer" style="min-height: 100px;"></div>
                        </div>

                        <div class="nwc-section nwc-liabilities-section">
                            <div class="nwc-section-header">
                                <h2><span class="nwc-badge">📉</span> Liabilities</h2>
                                <span class="nwc-section-total" id="liabilitiesTotal">$0.00</span>
                            </div>
                            <div id="liabilitiesContainer" style="min-height: 100px;"></div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="col-lg-6">
                        <div class="nwc-summary-card">
                            <div class="nwc-summary-item">
                                <span class="nwc-summary-label">Total Assets</span>
                                <span class="nwc-summary-value nwc-assets-color" id="summaryAssets">$0.00</span>
                            </div>
                            <div class="nwc-summary-divider"></div>
                            <div class="nwc-summary-item">
                                <span class="nwc-summary-label">Total Liabilities</span>
                                <span class="nwc-summary-value nwc-liabilities-color" id="summaryLiabilities">$0.00</span>
                            </div>
                            <div class="nwc-summary-divider nwc-summary-divider-thick"></div>
                            <div class="nwc-summary-item nwc-summary-networth">
                                <span class="nwc-summary-label">Your Net Worth</span>
                                <span class="nwc-summary-value" id="summaryNetWorth">$0.00</span>
                            </div>
                        </div>

                        <div class="nwc-charts-container">
                            <div class="nwc-chart-box">
                                <h3>Net Worth Breakdown</h3>
                                <canvas id="breakdownChart" height="80"></canvas>
                            </div>
                            <div class="nwc-chart-box">
                                <h3>Assets by Category</h3>
                                <canvas id="assetsChart" height="80"></canvas>
                            </div>
                            <div class="nwc-chart-box">
                                <h3>Liabilities by Category</h3>
                                <canvas id="liabilitiesChart" height="80"></canvas>
                            </div>
                        </div>

                        <div class="nwc-actions">
                            <button class="btn btn-primary w-100" onclick="window.nwcApp.exportPDF()">📥 Export as PDF</button>
                            <button class="btn btn-outline-secondary w-100 mt-2" onclick="window.nwcApp.exportCSV()">📊 Export as CSV</button>
                            <button class="btn btn-outline-danger w-100 mt-2" onclick="window.nwcApp.resetCalculator()">🔄 Reset Calculator</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    // Embed calculator immediately
    (function() {
        const NWC = {
            data: { assets: {}, liabilities: {} },

            assetCategories: {
                'cash': { label: 'Cash', icon: '💵' },
                'savings': { label: 'Savings Account', icon: '🏦' },
                'checking': { label: 'Checking Account', icon: '💳' },
                'investments': { label: 'Investments (Stocks/Bonds)', icon: '📈' },
                'retirement': { label: 'Retirement Accounts (401k/IRA)', icon: '🎯' },
                'real_estate': { label: 'Real Estate', icon: '🏠' },
                'vehicles': { label: 'Vehicles', icon: '🚗' },
                'cryptocurrency': { label: 'Cryptocurrency', icon: '₿' },
                'other_assets': { label: 'Other Assets', icon: '📦' }
            },

            liabilityCategories: {
                'mortgage': { label: 'Mortgage', icon: '🏠' },
                'home_equity': { label: 'Home Equity Loan', icon: '🏡' },
                'auto_loan': { label: 'Auto Loan', icon: '🚗' },
                'student_loan': { label: 'Student Loan', icon: '📚' },
                'credit_card': { label: 'Credit Card Debt', icon: '💳' },
                'personal_loan': { label: 'Personal Loan', icon: '💰' },
                'medical': { label: 'Medical Debt', icon: '🏥' },
                'other_liabilities': { label: 'Other Debts', icon: '📋' }
            },

            init() {
                this.loadFromStorage();
                this.renderAll();
                this.setupListeners();
                console.log('Net Worth Calculator Initialized');
            },

            loadFromStorage() {
                const stored = localStorage.getItem('nwc-data');
                if (stored) this.data = JSON.parse(stored);
            },

            saveToStorage() {
                localStorage.setItem('nwc-data', JSON.stringify(this.data));
            },

            renderAll() {
                this.renderAssets();
                this.renderLiabilities();
                this.updateSummary();
            },

            renderAssets() {
                if (!Object.keys(this.data.assets).length) {
                    Object.keys(this.assetCategories).forEach(k => this.data.assets[k] = []);
                }
                let html = '';
                Object.entries(this.assetCategories).forEach(([key, config]) => {
                    const items = this.data.assets[key] || [];
                    const total = items.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
                    html += this.getCategoryHTML(key, config, items, total, 'assets');
                });
                document.getElementById('assetsContainer').innerHTML = html;
            },

            renderLiabilities() {
                if (!Object.keys(this.data.liabilities).length) {
                    Object.keys(this.liabilityCategories).forEach(k => this.data.liabilities[k] = []);
                }
                let html = '';
                Object.entries(this.liabilityCategories).forEach(([key, config]) => {
                    const items = this.data.liabilities[key] || [];
                    const total = items.reduce((s, i) => s + parseFloat(i.amount || 0), 0);
                    html += this.getCategoryHTML(key, config, items, total, 'liabilities');
                });
                document.getElementById('liabilitiesContainer').innerHTML = html;
            },

            getCategoryHTML(key, config, items, total, type) {
                const itemsHTML = items.map((item, idx) => `
                    <li class="nwc-item">
                        <span>${item.name}</span>
                        <span class="nwc-item-amount">$${this.formatNumber(item.amount)}</span>
                        <button class="nwc-item-delete" onclick="window.nwcApp.deleteItem('${type}','${key}',${idx})">×</button>
                    </li>
                `).join('');

                return `
                    <div class="nwc-category">
                        <div class="nwc-category-title">
                            ${config.icon} ${config.label}
                            ${items.length ? `<span class="nwc-category-total">$${this.formatNumber(total)}</span>` : ''}
                        </div>
                        ${items.length ? `<ul class="nwc-items-list">${itemsHTML}</ul>` : ''}
                        <button class="btn btn-sm btn-outline-secondary w-100 mt-2" onclick="window.nwcApp.openForm('${type}','${key}')">
                            + Add ${config.label}
                        </button>
                    </div>
                `;
            },

            openForm(type, category) {
                this.currentType = type;
                this.currentCategory = category;
                const title = type === 'assets' ? 'Add New Asset' : 'Add New Liability';
                document.getElementById('formTitle').textContent = title;

                const categories = type === 'assets' ? this.assetCategories : this.liabilityCategories;
                const select = document.getElementById('itemCategory');
                select.innerHTML = Object.entries(categories).map(([k, c]) =>
                    `<option value="${k}" ${k === category ? 'selected' : ''}>${c.icon} ${c.label}</option>`
                ).join('');

                document.getElementById('itemName').value = '';
                document.getElementById('itemAmount').value = '';
                document.getElementById('quickAddForm').style.display = 'block';
                document.getElementById('itemName').focus();
            },

            closeForm() {
                document.getElementById('quickAddForm').style.display = 'none';
            },

            saveItem() {
                const name = document.getElementById('itemName').value.trim();
                const amountStr = document.getElementById('itemAmount').value.trim();
                const category = document.getElementById('itemCategory').value;

                if (!name) { alert('Please enter a name'); return; }
                if (!amountStr) { alert('Please enter an amount'); return; }

                const amount = parseFloat(amountStr);
                if (isNaN(amount) || amount <= 0) { alert('Please enter valid amount'); return; }

                const dataType = this.currentType === 'assets' ? this.data.assets : this.data.liabilities;
                if (!dataType[category]) dataType[category] = [];
                dataType[category].push({ name, amount });

                this.saveToStorage();
                this.renderAll();
                this.closeForm();
                alert('✓ ' + name + ' added!');
            },

            deleteItem(type, category, index) {
                if (!confirm('Delete this item?')) return;
                const dataType = type === 'assets' ? this.data.assets : this.data.liabilities;
                dataType[category].splice(index, 1);
                this.saveToStorage();
                this.renderAll();
            },

            updateSummary() {
                const totalAssets = Object.values(this.data.assets).reduce((s, i) => s + i.reduce((x, y) => x + parseFloat(y.amount || 0), 0), 0);
                const totalLiabilities = Object.values(this.data.liabilities).reduce((s, i) => s + i.reduce((x, y) => x + parseFloat(y.amount || 0), 0), 0);
                const netWorth = totalAssets - totalLiabilities;

                document.getElementById('assetsTotal').textContent = '$' + this.formatNumber(totalAssets);
                document.getElementById('liabilitiesTotal').textContent = '$' + this.formatNumber(totalLiabilities);
                document.getElementById('summaryAssets').textContent = '$' + this.formatNumber(totalAssets);
                document.getElementById('summaryLiabilities').textContent = '$' + this.formatNumber(totalLiabilities);
                document.getElementById('summaryNetWorth').textContent = '$' + this.formatNumber(netWorth);

                this.updateCharts(totalAssets, totalLiabilities);
            },

            updateCharts(totalAssets, totalLiabilities) {
                if (typeof Chart === 'undefined') return;

                this.updateChart('breakdownChart', {
                    type: 'doughnut',
                    data: {
                        labels: ['Assets', 'Liabilities'],
                        datasets: [{ data: [totalAssets, totalLiabilities], backgroundColor: ['#10b981', '#D81E3A'], borderColor: ['#059669', '#A01529'], borderWidth: 2 }]
                    },
                    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }
                });
            },

            updateChart(id, config) {
                const ctx = document.getElementById(id);
                if (!ctx) return;
                if (window.nwcCharts && window.nwcCharts[id]) window.nwcCharts[id].destroy();
                if (!window.nwcCharts) window.nwcCharts = {};
                window.nwcCharts[id] = new Chart(ctx, config);
            },

            exportPDF() {
                if (typeof html2pdf === 'undefined') { alert('PDF export unavailable'); return; }
                const element = document.querySelector('.nwc-container');
                html2pdf().set({ margin: 10, filename: 'net-worth.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } }).from(element).save();
            },

            exportCSV() {
                let csv = 'Net Worth Report\n' + new Date().toLocaleDateString() + '\n\nASSETS\n';
                Object.entries(this.data.assets).forEach(([k, items]) => {
                    items.forEach(i => csv += this.assetCategories[k].label + ',' + i.name + ',' + i.amount + '\n');
                });
                const ta = Object.values(this.data.assets).reduce((s, i) => s + i.reduce((x, y) => x + parseFloat(y.amount || 0), 0), 0);
                csv += 'TOTAL,' + ta + '\n\nLIABILITIES\n';
                Object.entries(this.data.liabilities).forEach(([k, items]) => {
                    items.forEach(i => csv += this.liabilityCategories[k].label + ',' + i.name + ',' + i.amount + '\n');
                });
                const tl = Object.values(this.data.liabilities).reduce((s, i) => s + i.reduce((x, y) => x + parseFloat(y.amount || 0), 0), 0);
                csv += 'TOTAL,' + tl + '\nNET WORTH,' + (ta - tl);

                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'net-worth.csv';
                a.click();
            },

            resetCalculator() {
                if (!confirm('Reset all data?')) return;
                this.data = { assets: {}, liabilities: {} };
                this.saveToStorage();
                this.renderAll();
            },

            setupListeners() {
                // Event delegation handled in onclick attributes
            },

            formatNumber(n) {
                return parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        };

        window.nwcApp = NWC;
        document.addEventListener('DOMContentLoaded', () => NWC.init());
    })();
    </script>

    <?php
    return ob_get_clean();
}
add_shortcode('net-worth-calculator', 'nwc_calculator_shortcode');
