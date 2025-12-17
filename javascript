import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Treemap 
} from 'recharts';
import { Search, DollarSign, TrendingUp, Users, ChevronRight, Menu } from 'lucide-react';

// --- Mock Data (In production, import the JSON above) ---
const BUDGET_DATA = {
  fiscalYear: "2025",
  totalBudget: 497023889,
  metrics: { yoyChange: "7.5%", taxableValue: "10.11%", positions: 1331 },
  revenues: [
    { name: "Ad Valorem Taxes", value: 132601385, color: "#003366" },
    { name: "Intergov. Revenue", value: 20176550, color: "#0055aa" },
    { name: "Charges for Services", value: 67978626, color: "#0077cc" },
    { name: "Licenses/Permits", value: 29324571, color: "#3399ff" },
    { name: "Transfers/Fund Bal", value: 240127209, color: "#66b2ff" }
  ],
  expenditures: [
    { name: "General Gov", value: 100300052, children: [
        { name: "Board of Comm.", size: 863245 },
        { name: "Facilities Mgmt", size: 6199547 },
        { name: "IT Services", size: 3158313 }
    ]},
    { name: "Public Safety", value: 82063291, children: [
        { name: "Sheriff", size: 41238433 },
        { name: "Fire Rescue", size: 19867212 },
        { name: "EMS", size: 14689536 }
    ]},
    { name: "Physical Env.", value: 120930271, children: [
        { name: "Utilities", size: 59577108 },
        { name: "Solid Waste", size: 32274884 },
        { name: "Stormwater", size: 9832460 }
    ]},
    { name: "Transportation", value: 55852348, children: [
        { name: "Road Maint.", size: 8879671 },
        { name: "Engineering", size: 41764754 }
    ]}
  ]
};

// --- Helper Components ---

const MetricCard = ({ title, value, subtext, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="p-2 bg-blue-50 rounded-full">
        <Icon className="w-5 h-5 text-blue-700" />
      </div>
    </div>
    <div className="text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-green-600 mt-2 font-medium">{subtext}</div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded shadow-lg text-sm">
        <p className="font-bold">{payload[0].name}</p>
        <p>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// --- Main Application ---

export default function BudgetDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Filter logic for the global search table
  const filteredLineItems = useMemo(() => {
    const allItems = [];
    BUDGET_DATA.expenditures.forEach(cat => {
      cat.children.forEach(dept => {
        allItems.push({ ...dept, category: cat.name });
      });
    });
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Header - USAspending Style */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Citrus County</h1>
              <p className="text-xs text-blue-200 font-medium">Spending Explorer 2025</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <button onClick={() => setActiveTab('overview')} className={`hover:text-blue-200 ${activeTab === 'overview' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-100'}`}>Overview</button>
            <button onClick={() => setActiveTab('explorer')} className={`hover:text-blue-200 ${activeTab === 'explorer' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-100'}`}>Spending Explorer</button>
            <button onClick={() => setActiveTab('search')} className={`hover:text-blue-200 ${activeTab === 'search' ? 'text-white border-b-2 border-white pb-1' : 'text-blue-100'}`}>Search Records</button>
          </div>
          <Menu className="w-6 h-6 md:hidden cursor-pointer" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        
        {/* Global Search Bar */}
        <div className="max-w-3xl mx-auto mb-12 relative">
          <input 
            type="text" 
            placeholder="Search for departments, funds, or line items..." 
            className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4.5 w-6 h-6 text-slate-400" />
        </div>

        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 fade-in">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard 
                title="Total Adopted Budget" 
                value={`$${(BUDGET_DATA.totalBudget / 1000000).toFixed(1)} Million`} 
                subtext={`+${BUDGET_DATA.metrics.yoyChange} from FY24`} 
                icon={DollarSign} 
              />
              <MetricCard 
                title="Taxable Value Growth" 
                value={BUDGET_DATA.metrics.taxableValue} 
                subtext="Robust housing market" 
                icon={TrendingUp} 
              />
              <MetricCard 
                title="Total Workforce" 
                value={BUDGET_DATA.metrics.positions} 
                subtext="Full-time employees" 
                icon={Users} 
              />
            </div>

            {/* Visualizations Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Where Money Comes From */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Where the Money Comes From</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={BUDGET_DATA.revenues}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {BUDGET_DATA.revenues.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Where Money Goes */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Where the Money Goes (By Function)</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BUDGET_DATA.expenditures} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#003366" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- EXPLORER TAB (Treemap Logic) --- */}
        {activeTab === 'explorer' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-[600px]">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Interactive Spending Explorer</h2>
            <p className="text-sm text-slate-500 mb-6">Click on categories to drill down into specific departments.</p>
            <ResponsiveContainer width="100%" height="90%">
              <Treemap
                data={BUDGET_DATA.expenditures}
                dataKey="value"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#0055aa"
                content={({ root, depth, x, y, width, height, index, name, value }) => (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={depth === 1 ? "#003366" : "#2563eb"}
                      stroke="#fff"
                    />
                    {width > 50 && height > 50 && (
                      <text
                        x={x + width / 2}
                        y={y + height / 2}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={12}
                      >
                        {name}
                      </text>
                    )}
                  </g>
                )}
              >
                <Tooltip />
              </Treemap>
            </ResponsiveContainer>
          </div>
        )}

        {/* --- SEARCH / DATA TABLE TAB --- */}
        {(activeTab === 'search' || searchTerm) && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mt-8">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Budget Line Items</h2>
              <span className="text-sm text-slate-500">{filteredLineItems.length} records found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase">
                  <tr>
                    <th className="px-6 py-3">Department / Line Item</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLineItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 text-slate-500">{item.category}</td>
                      <td className="px-6 py-4 text-right font-mono text-slate-700">
                        ${item.size.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-blue-600 hover:text-blue-800 flex items-center justify-center mx-auto gap-1 text-xs font-bold uppercase">
                          Details <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLineItems.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-slate-500 italic">
                        No records found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
