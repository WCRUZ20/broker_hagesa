import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import API from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

export default function DashboardHome({ user = { user_name: 'Usuario' } }) {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    policies: [],
    vehicles: [],
    clients: [],
    sellers: [],
    brands: [],
    insurers: []
  });

  useEffect(() => {
    loadDashboardData();
    
    const handler = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };
    window.addEventListener("darkModeChange", handler);
    return () => window.removeEventListener("darkModeChange", handler);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [policiesRes, vehiclesRes, clientsRes, sellersRes, brandsRes, insurersRes] = await Promise.all([
        API.get("/polizas"),
        API.get("/vehiculos"), 
        API.get("/clientes"),
        API.get("/vendedores"),
        API.get("/marcas"),
        API.get("/aseguradoras")
      ]);

      const policies = policiesRes.data || [];
      const vehicles = vehiclesRes.data || [];
      const clients = clientsRes.data || [];
      const sellers = sellersRes.data || [];
      const brands = brandsRes.data || [];
      const insurers = insurersRes.data || [];

      // Enriquecer pólizas con datos relacionados
      const enrichedPolicies = policies.map(policy => {
        const insurer = insurers.find(ins => ins.id === policy.id_insurance);
        const client = clients.find(cli => cli.id === policy.id_ctms);
        const seller = sellers.find(sel => sel.id === policy.id_slrs);
        
        return {
          ...policy,
          InsuranceName: insurer?.CompanyName || 'Sin aseguradora',
          ClientName: client ? `${client.nombre} ${client.apellidos || ''}`.trim() : 'Sin cliente',
          SellerName: seller?.nombre || 'Sin vendedor'
        };
      });

      // Enriquecer vehículos con marca
      const enrichedVehicles = vehicles.map(vehicle => {
        const brand = brands.find(br => br.id === vehicle.id_brand);
        return {
          ...vehicle,
          BrandName: brand?.Name || 'Sin marca'
        };
      });

      setDashboardData({
        policies: enrichedPolicies,
        vehicles: enrichedVehicles,
        clients,
        sellers,
        brands,
        insurers
      });

    } catch (error) {
      console.error("Error cargando datos del dashboard:", error);
      alert("Error al cargar los datos del dashboard. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas principales
  const getStats = () => {
    const activePolicies = dashboardData.policies.filter(p => p.activo === true || p.activo === 1);
    
    return {
      totalPolicies: dashboardData.policies.length,
      activePolicies: activePolicies.length,
      totalVehicles: dashboardData.vehicles.length,
      totalClients: dashboardData.clients.length,
      totalSellers: dashboardData.sellers.length,
      totalInsuredValue: activePolicies.reduce((sum, p) => sum + (parseFloat(p.AscValue) || 0), 0)
    };
  };

  // Calcular pólizas por vencer
  const getExpiringPolicies = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return dashboardData.policies
      .filter(p => {
        const dueDate = new Date(p.DueDate);
        return dueDate >= today && 
               dueDate <= thirtyDaysFromNow && 
               (p.activo === true || p.activo === 1);
      })
      .sort((a, b) => new Date(a.DueDate) - new Date(b.DueDate));
  };

  // Calcular pólizas vencidas
  const getExpiredPolicies = () => {
    const today = new Date();
    
    return dashboardData.policies.filter(p => {
      const dueDate = new Date(p.DueDate);
      return dueDate < today && (p.activo === true || p.activo === 1);
    });
  };

  // Datos para gráfico de vehículos por marca
  const getVehiclesByBrand = () => {
    const brandCounts = dashboardData.vehicles.reduce((acc, vehicle) => {
      const brand = vehicle.BrandName || 'Sin marca';
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(brandCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Datos para gráfico de pólizas por aseguradora
  const getPoliciesByInsurer = () => {
    const insurerCounts = dashboardData.policies.reduce((acc, policy) => {
      const insurer = policy.InsuranceName || 'Sin aseguradora';
      acc[insurer] = (acc[insurer] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(insurerCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Datos para gráfico de tendencia mensual
  const getMonthlyTrend = () => {
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      const monthPolicies = dashboardData.policies.filter(p => {
        const policyDate = new Date(p.InitDate);
        return policyDate.getMonth() === date.getMonth() && 
               policyDate.getFullYear() === date.getFullYear() &&
               (p.activo === true || p.activo === 1);
      });
      
      monthlyData.push({
        month: monthName,
        valor: monthPolicies.reduce((sum, p) => sum + (parseFloat(p.AscValue) || 0), 0),
        polizas: monthPolicies.length
      });
    }
    
    return monthlyData;
  };

  // Calcular días hasta vencimiento
  const getDaysUntilExpiry = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const stats = getStats();
  const expiringSoon = getExpiringPolicies();
  const expiredPolicies = getExpiredPolicies();
  const vehiclesByBrand = getVehiclesByBrand();
  const policiesByInsurer = getPoliciesByInsurer();
  const monthlyTrend = getMonthlyTrend();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className={`mb-1 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                Dashboard Principal
              </h2>
              <p className={`mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                Bienvenido, {user.user_name} - Resumen general del sistema
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-primary btn-sm" 
                onClick={loadDashboardData}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de pólizas vencidas */}
      {expiredPolicies.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>¡Atención!</strong> Hay {expiredPolicies.length} póliza{expiredPolicies.length !== 1 ? 's' : ''} vencida{expiredPolicies.length !== 1 ? 's' : ''} que requiere{expiredPolicies.length === 1 ? '' : 'n'} atención inmediata.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-shield-check text-primary fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {stats.totalPolicies}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Total Pólizas
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-success bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-shield-fill-check text-success fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {stats.activePolicies}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Pólizas Activas
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-info bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-car-front text-info fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {stats.totalVehicles}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Total Vehículos
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-warning bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-people text-warning fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {stats.totalClients}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Total Clientes
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-danger bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-exclamation-triangle text-danger fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    {expiringSoon.length}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Por Vencer (30d)
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <div className="bg-secondary bg-opacity-10 rounded-3 p-2">
                    <i className="bi bi-currency-dollar text-secondary fs-4"></i>
                  </div>
                </div>
                <div>
                  <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                    ${stats.totalInsuredValue.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </h5>
                  <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    Valor Total Asegurado
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row mb-4">
        {/* Tendencia Mensual */}
        <div className="col-lg-8 mb-4">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-header border-0 pb-0">
              <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                Tendencia de Pólizas y Valor Asegurado
              </h5>
              <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                Últimos 6 meses
              </small>
            </div>
            <div className="card-body">
              {monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#404040' : '#e0e0e0'} />
                    <XAxis dataKey="month" stroke={darkMode ? '#888' : '#666'} />
                    <YAxis stroke={darkMode ? '#888' : '#666'} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? '#333' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#000'
                      }}
                      formatter={(value, name) => {
                        if (name === 'valor') {
                          return [`$${value.toLocaleString('es-ES')}`, 'Valor Asegurado'];
                        }
                        return [value, 'Número de Pólizas'];
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="valor" 
                      stroke="#0088FE" 
                      strokeWidth={3}
                      name="Valor Asegurado ($)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="polizas" 
                      stroke="#00C49F" 
                      strokeWidth={3}
                      name="Número de Pólizas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-graph-up text-muted fs-1"></i>
                  <p className={`mt-3 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    No hay datos disponibles para mostrar la tendencia
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehículos por Marca */}
        <div className="col-lg-4 mb-4">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-header border-0 pb-0">
              <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                Vehículos por Marca
              </h5>
              <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                Distribución actual
              </small>
            </div>
            <div className="card-body">
              {vehiclesByBrand.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehiclesByBrand}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {vehiclesByBrand.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? '#333' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#000'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-car-front text-muted fs-1"></i>
                  <p className={`mt-3 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    No hay vehículos registrados
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fila inferior */}
      <div className="row">
        {/* Pólizas por Vencer */}
        <div className="col-lg-6 mb-4">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-header border-0 d-flex justify-content-between align-items-center">
              <div>
                <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                  Pólizas por Vencer
                </h5>
                <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                  Próximos 30 días
                </small>
              </div>
              <span className="badge bg-warning rounded-pill">
                {expiringSoon.length} póliza{expiringSoon.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="card-body">
              {expiringSoon.length > 0 ? (
                <div className="table-responsive">
                  <table className={`table table-sm ${darkMode ? 'table-dark' : ''}`}>
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th>Vencimiento</th>
                        <th>Días</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringSoon.slice(0, 8).map((policy) => {
                        const daysUntilExpiry = getDaysUntilExpiry(policy.DueDate);
                        return (
                          <tr key={policy.id}>
                            <td className="fw-bold">{policy.PolicyNum}</td>
                            <td>{policy.ClientName}</td>
                            <td>{new Date(policy.DueDate).toLocaleDateString('es-ES')}</td>
                            <td>
                              <span className={`badge ${
                                daysUntilExpiry <= 7 ? 'bg-danger' : 
                                daysUntilExpiry <= 15 ? 'bg-warning' : 'bg-info'
                              } rounded-pill`}>
                                {daysUntilExpiry} día{daysUntilExpiry !== 1 ? 's' : ''}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {expiringSoon.length > 8 && (
                        <tr>
                          <td colSpan="4" className="text-center py-2">
                            <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                              ... y {expiringSoon.length - 8} póliza{expiringSoon.length - 8 !== 1 ? 's' : ''} más
                            </small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-check-circle text-success fs-1"></i>
                  <p className={`mt-3 mb-0 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    No hay pólizas por vencer en los próximos 30 días
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pólizas por Aseguradora */}
        <div className="col-lg-6 mb-4">
          <div className={`card border-0 shadow-sm h-100 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
            <div className="card-header border-0">
              <h5 className={`mb-0 fw-bold ${darkMode ? 'text-white' : 'text-dark'}`}>
                Pólizas por Aseguradora
              </h5>
              <small className={`${darkMode ? 'text-muted' : 'text-secondary'}`}>
                Distribución actual
              </small>
            </div>
            <div className="card-body">
              {policiesByInsurer.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={policiesByInsurer.slice(0, 8)} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#404040' : '#e0e0e0'} />
                    <XAxis type="number" stroke={darkMode ? '#888' : '#666'} />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke={darkMode ? '#888' : '#666'}
                      width={120}
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: darkMode ? '#333' : '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        color: darkMode ? '#fff' : '#000'
                      }}
                    />
                    <Bar dataKey="value" fill="#0088FE" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-building text-muted fs-1"></i>
                  <p className={`mt-3 ${darkMode ? 'text-muted' : 'text-secondary'}`}>
                    No hay datos de aseguradoras disponibles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}