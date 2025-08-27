import Chart from 'react-apexcharts';

function Results({ rawData }) {
    const labels = Object.keys(rawData);
    const values = Object.values(rawData);
    const order = ['HO', 'HED', 'HEN'];

    const labelMap = {
        HO: 'Horas Ordinarias',
        HED: 'Horas Extras Diurnas',
        HEN: 'Horas Extras Nocturnas'
    };

    const colorMap = {
        HO: '#41b43dff',
        HED: '#FF6347',
        HEN: '#521aebff'
    };

    const defaultColor = '#888888';

    const sortedLabels = [
        ...order.filter(l => l in rawData),
        ...Object.keys(rawData).filter(l => !order.includes(l))
    ];

    const sortedValues = sortedLabels.map(label => {
        const raw = rawData[label];
        return Math.round(raw * 2) / 2;
    });

    const descriptiveLabels = sortedLabels.map(label => labelMap[label] || label);
    const barColors = sortedLabels.map(label => colorMap[label] || defaultColor);

    const chartOptions = {
        chart: { type: 'bar' },
        xaxis: { categories: descriptiveLabels },
        title: { text: 'Horas por Concepto' },
        plotOptions: { bar: { columnWidth: '50%', distributed: true } },
        colors: barColors,
        dataLabels: { enabled: true, formatter: (val) => `${val} hrs` },
    };

    const chartSeries = [{ name: 'Horas', data: sortedValues }];

    const donutOptions = {
        chart: { type: 'donut' },
        labels: descriptiveLabels,
        colors: barColors,
        legend: { position: 'bottom' },
        dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
        title: { text: 'Distribución porcentual' },
    };

    const donutSeries = sortedValues;

    return (
        <div style={{ marginTop: '30px' }}>
            <h4>Resumen de Horas trabajadas</h4>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {sortedLabels.map((label, index) => (
                    <div key={label} style={{
                        border: `2px solid ${barColors[index]}`,
                        borderRadius: '8px',
                        padding: '15px',
                        minWidth: '180px',
                        textAlign: 'center',
                        background: '#f9f9f9',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '8px', color: barColors[index] }}>
                            {labelMap[label] || label}
                        </h3>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                            {sortedValues[index]} hrs
                        </p>
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: '600px', marginBottom: '20px' }}>
                <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                <Chart options={donutOptions} series={donutSeries} type="donut" height={300} />
            </div>
        </div>
    );
}

export default Results;
