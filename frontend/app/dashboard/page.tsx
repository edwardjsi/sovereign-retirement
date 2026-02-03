'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [financials, setFinancials] = useState({
    current_age: 30,
    retirement_age: 60,
    monthly_expenses: 50000,
    current_savings: 500000,
    monthly_contribution: 25000,
    annual_inflation_rate: 0.06,
    life_expectancy_age: 85,
    post_retirement_return_rate: 0.08
  });
  const [loading, setLoading] = useState(false);
  const [projections, setProjections] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
    } else {
      setUser(JSON.parse(userData));
      loadFinancials(JSON.parse(userData).id);
    }
  }, [router]);

  const loadFinancials = async (userId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/financials/${userId}`);
      const data = await response.json();
      if (data.current_age) {
        setFinancials({...financials, ...data});
      }
    } catch (err) {
      console.error('Failed to load financials');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/financials/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, ...financials })
      });
      alert('✅ Financial information updated!');
      calculateProjections();
    } catch (err) {
      alert('❌ Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const calculateProjections = () => {
    // ========================================
    // SECTION 3: DERIVED VALUES
    // ========================================
    const current_age = financials.current_age;
    const retirement_age = financials.retirement_age;
    const current_savings = financials.current_savings;
    const monthly_contribution = financials.monthly_contribution;
    const annual_inflation_rate = financials.annual_inflation_rate;
    
    const years_to_retirement = retirement_age - current_age;
    const total_months = years_to_retirement * 12;

    // Mandatory Constraints
    if (years_to_retirement <= 0) {
      alert('❌ Error: Years to retirement must be positive');
      return;
    }

    if (total_months < 12) {
      alert('❌ Error: Must have at least 12 months until retirement');
      return;
    }

    const scenarios = [
      { name: 'Conservative', annual_return_rate: 0.08, color: '#28a745', icon: '🛡️' },
      { name: 'Moderate', annual_return_rate: 0.12, color: '#ffc107', icon: '⚖️' },
      { name: 'Aggressive', annual_return_rate: 0.15, color: '#dc3545', icon: '🚀' }
    ];

    const results = scenarios.map(scenario => {
      const annual_return_rate = scenario.annual_return_rate;
      const monthly_return_rate = annual_return_rate / 12;

      // Guardrail against rate misuse
      if (monthly_return_rate >= 0.02) {
        console.warn(`Warning: Monthly rate ${monthly_return_rate} seems high for ${scenario.name}`);
      }

      // ========================================
      // SECTION 4: FUTURE VALUE OF MONTHLY SIP
      // (Ordinary Annuity)
      // ========================================
      const FV_SIP = monthly_contribution * 
        ((Math.pow(1 + monthly_return_rate, total_months) - 1) / monthly_return_rate);

      // ========================================
      // SECTION 5: FUTURE VALUE OF CURRENT SAVINGS
      // ========================================
      const FV_CURRENT = current_savings * 
        Math.pow(1 + monthly_return_rate, total_months);

      // ========================================
      // SECTION 6: TOTAL RETIREMENT CORPUS
      // ========================================
      const TOTAL_RETIREMENT_CORPUS = FV_SIP + FV_CURRENT;

      // ========================================
      // SECTION 10: INFLATION-ADJUSTED (REAL RETURN) LOGIC
      // ========================================
      
      // Real Annual Return using Fisher equation
      const REAL_ANNUAL_RETURN = 
        ((1 + annual_return_rate) / (1 + annual_inflation_rate)) - 1;
      
      // Monthly Real Return Rate
      const monthly_real_return_rate = REAL_ANNUAL_RETURN / 12;

      // Constraint check
      if (monthly_real_return_rate < 0) {
        console.warn(`Warning: Real return is negative for ${scenario.name}. Inflation exceeds returns.`);
      }

      // Calculate Real Corpus (using real returns)
      let FV_SIP_REAL;
      if (monthly_real_return_rate > 0.0001) {
        FV_SIP_REAL = monthly_contribution * 
          ((Math.pow(1 + monthly_real_return_rate, total_months) - 1) / monthly_real_return_rate);
      } else {
        // If real return is near zero or negative
        FV_SIP_REAL = monthly_contribution * total_months;
      }

      const FV_CURRENT_REAL = current_savings * 
        Math.pow(1 + Math.max(0, monthly_real_return_rate), total_months);

      const REAL_RETIREMENT_CORPUS = FV_SIP_REAL + FV_CURRENT_REAL;

      // ========================================
      // SECTION 11: RETIREMENT EXPENSE SUSTAINABILITY (SWP LOGIC)
      // ========================================
      
      const current_monthly_expense = financials.monthly_expenses;
      const life_expectancy_age = financials.life_expectancy_age;
      const post_retirement_return_rate = financials.post_retirement_return_rate;

      // Derived Values
      const retirement_years = life_expectancy_age - retirement_age;
      const retirement_months = retirement_years * 12;

      // First-Year Retirement Expense (inflated to retirement)
      const FIRST_YEAR_ANNUAL_EXPENSE = current_monthly_expense * 12 * 
        Math.pow(1 + annual_inflation_rate, years_to_retirement);

      const MONTHLY_RETIREMENT_EXPENSE = FIRST_YEAR_ANNUAL_EXPENSE / 12;

      // Real Post-Retirement Return
      const REAL_POST_RET_RETURN = 
        ((1 + post_retirement_return_rate) / (1 + annual_inflation_rate)) - 1;

      const monthly_real_post_ret_rate = REAL_POST_RET_RETURN / 12;

      // SWP Sustainability Formula (PV of withdrawals)
      let REQUIRED_RETIREMENT_CORPUS;
      
      if (monthly_real_post_ret_rate > 0.0001) {
        REQUIRED_RETIREMENT_CORPUS = MONTHLY_RETIREMENT_EXPENSE * 
          ((1 - Math.pow(1 + monthly_real_post_ret_rate, -retirement_months)) / 
          monthly_real_post_ret_rate);
      } else {
        // If real return is zero or negative
        REQUIRED_RETIREMENT_CORPUS = MONTHLY_RETIREMENT_EXPENSE * retirement_months;
      }

      // Sustainability Decision Rule
      const is_sustainable = REAL_RETIREMENT_CORPUS >= REQUIRED_RETIREMENT_CORPUS;

      // ========================================
      // SECTION 12: SAFE WITHDRAWAL RATE (OPTIONAL CROSS-CHECK)
      // ========================================
      
      const safe_monthly_withdrawal = REAL_RETIREMENT_CORPUS * 0.03 / 12;
      const has_longevity_risk = MONTHLY_RETIREMENT_EXPENSE > safe_monthly_withdrawal;

      // Simple years lasting (nominal corpus / annual expenses)
      const simple_years_lasting = Math.floor(
        TOTAL_RETIREMENT_CORPUS / (current_monthly_expense * 12)
      );

      return {
        name: scenario.name,
        icon: scenario.icon,
        annual_return_rate,
        color: scenario.color,
        
        // Outputs
        years_to_retirement,
        nominal_corpus: TOTAL_RETIREMENT_CORPUS,
        real_corpus: REAL_RETIREMENT_CORPUS,
        real_annual_return: REAL_ANNUAL_RETURN,
        
        // Sustainability
        monthly_retirement_expense: MONTHLY_RETIREMENT_EXPENSE,
        required_corpus: REQUIRED_RETIREMENT_CORPUS,
        is_sustainable,
        
        // Longevity
        has_longevity_risk,
        safe_monthly_withdrawal,
        
        // Display
        simple_years_lasting
      };
    });

    setProjections({
      years_to_retirement,
      total_months,
      results,
      inflation_rate: annual_inflation_rate,
      life_expectancy: financials.life_expectancy_age
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (rate: number) => {
    return (rate * 100).toFixed(2) + '%';
  };

  if (!user) return <div>Loading...</div>;

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#000',
    backgroundColor: '#fff'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: 'white' }}>💰 Retirement Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ color: 'white', marginBottom: '20px', fontSize: '1.2rem' }}>
          Welcome back, <strong>{user.name}</strong>! 👋
        </div>

        {/* Financial Information Form */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📊 Financial Information</h2>
          
          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Current Age
                </label>
                <input
                  type="number"
                  value={financials.current_age}
                  onChange={(e) => setFinancials({...financials, current_age: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={financials.retirement_age}
                  onChange={(e) => setFinancials({...financials, retirement_age: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Life Expectancy
                </label>
                <input
                  type="number"
                  value={financials.life_expectancy_age}
                  onChange={(e) => setFinancials({...financials, life_expectancy_age: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  value={financials.current_savings}
                  onChange={(e) => setFinancials({...financials, current_savings: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Monthly SIP (₹)
                </label>
                <input
                  type="number"
                  value={financials.monthly_contribution}
                  onChange={(e) => setFinancials({...financials, monthly_contribution: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Monthly Expenses (₹)
                </label>
                <input
                  type="number"
                  value={financials.monthly_expenses}
                  onChange={(e) => setFinancials({...financials, monthly_expenses: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Annual Inflation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={financials.annual_inflation_rate * 100}
                  onChange={(e) => setFinancials({...financials, annual_inflation_rate: parseFloat(e.target.value) / 100})}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: 'bold' }}>
                  Post-Retirement Return Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={financials.post_retirement_return_rate * 100}
                  onChange={(e) => setFinancials({...financials, post_retirement_return_rate: parseFloat(e.target.value) / 100})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 30px',
                  background: loading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : 'Update & Calculate'}
              </button>

              <button
                type="button"
                onClick={calculateProjections}
                style={{
                  padding: '12px 30px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Calculate Projections
              </button>
            </div>
          </form>
        </div>

        {/* Retirement Projections */}
        {projections && projections.results && projections.results.length > 0 && (
          <>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '10px' }}>
                📈 Retirement Projections
              </h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                <strong>{projections.years_to_retirement} years</strong> ({projections.total_months} months) until retirement • 
                Inflation: <strong>{formatPercent(projections.inflation_rate)}</strong> • 
                Life Expectancy: <strong>{projections.life_expectancy} years</strong>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                {projections.results.map((result: any, idx: number) => (
                  <div key={idx} style={{
                    padding: '20px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: `3px solid ${result.color}`
                  }}>
                    <h3 style={{ color: result.color, marginBottom: '15px', fontSize: '1.2rem' }}>
                      {result.icon} {result.name}
                    </h3>
                    
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                      Nominal Return: <strong>{formatPercent(result.annual_return_rate)}</strong><br/>
                      Real Return: <strong>{formatPercent(result.real_annual_return)}</strong>
                    </div>

                    <div style={{ 
                      padding: '15px', 
                      background: 'white', 
                      borderRadius: '6px',
                      marginBottom: '15px'
                    }}>
                      <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>
                        Nominal Corpus
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#000' }}>
                        {formatCurrency(result.nominal_corpus)}
                      </div>
                    </div>

                    <div style={{ 
                      padding: '15px', 
                      background: 'white', 
                      borderRadius: '6px',
                      marginBottom: '15px'
                    }}>
                      <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>
                        Real Corpus (Inflation-Adjusted)
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: result.color }}>
                        {formatCurrency(result.real_corpus)}
                      </div>
                    </div>

                    <div style={{ 
                      padding: '12px', 
                      background: result.is_sustainable ? '#d4edda' : '#f8d7da',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      border: result.is_sustainable ? '2px solid #28a745' : '2px solid #dc3545'
                    }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold', 
                        color: result.is_sustainable ? '#155724' : '#721c24',
                        marginBottom: '8px'
                      }}>
                        {result.is_sustainable ? '✅ SUSTAINABLE' : '⚠️ NOT SUSTAINABLE'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Monthly Need: {formatCurrency(result.monthly_retirement_expense)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Required: {formatCurrency(result.required_corpus)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Safe Withdrawal: {formatCurrency(result.safe_monthly_withdrawal)}
                      </div>
                    </div>

                    {result.has_longevity_risk && (
                      <div style={{ 
                        padding: '10px', 
                        background: '#fff3cd',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: '#856404',
                        border: '1px solid #ffc107'
                      }}>
                        ⚠️ <strong>Longevity Risk Detected</strong><br/>
                        Expenses exceed safe withdrawal rate
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Charts */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '20px' }}>
                📊 Visual Comparison
              </h2>

              {/* Real Corpus Chart */}
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '#555', marginBottom: '15px', fontSize: '1.1rem' }}>
                  Real Retirement Corpus (Inflation-Adjusted Purchasing Power)
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '30px', height: '320px' }}>
                  {projections.results.map((result: any, idx: number) => {
                    const maxCorpus = Math.max(...projections.results.map((r: any) => r.real_corpus));
                    const height = (result.real_corpus / maxCorpus) * 100;
                    
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '100%',
                          background: `linear-gradient(to top, ${result.color}, ${result.color}dd)`,
                          height: `${Math.max(height, 10)}%`,
                          borderRadius: '8px 8px 0 0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: result.name === 'Moderate' ? '#000' : 'white',
                          fontWeight: 'bold',
                          minHeight: '100px',
                          padding: '15px',
                          position: 'relative'
                        }}>
                          <div style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                            {formatCurrency(result.real_corpus)}
                          </div>
                          <div style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                            {result.is_sustainable ? '✅ Sustainable' : '⚠️ At Risk'}
                          </div>
                        </div>
                        <div style={{ 
                          marginTop: '15px', 
                          fontWeight: 'bold', 
                          color: result.color,
                          fontSize: '1rem'
                        }}>
                          {result.icon} {result.name}
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#666',
                          marginTop: '5px'
                        }}>
                          Real: {formatPercent(result.real_annual_return)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sustainability Comparison */}
              <div style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginTop: '30px'
              }}>
                <h3 style={{ color: '#555', marginBottom: '15px', fontSize: '1.1rem' }}>
                  💡 Key Insights
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  {projections.results.map((result: any, idx: number) => (
                    <div key={idx} style={{ fontSize: '0.85rem', color: '#666' }}>
                      <strong style={{ color: result.color }}>{result.name}:</strong>
                      <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                        <li>Real return: {formatPercent(result.real_annual_return)}</li>
                        <li>Status: {result.is_sustainable ? '✅ On track' : '⚠️ Needs adjustment'}</li>
                        {result.has_longevity_risk && <li style={{ color: '#856404' }}>⚠️ Longevity risk</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
