export interface ExportData {
    data: any[];
    stats: {
        total: number;
        avgPrice: number;
        avgKm: number;
    };
    filters?: {
        brand?: string;
        dateRange?: string;
    };
}

export function exportToCSV(data: ExportData) {
    const headers = ["ID", "Title", "Price", "Brand", "Model", "Year", "Kilometers", "Fuel Type", "Transmission", "Condition", "Link"];
    
    const rows = data.data.map((item) => [
        item.id || "",
        item.title || "",
        item.price || 0,
        item.attributes?.brand || "",
        item.attributes?.model || "",
        item.attributes?.year || "",
        item.attributes?.kilometers || 0,
        item.attributes?.fuelType || "",
        item.attributes?.transmission || "",
        item.condition || "",
        item.permalink || "",
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
        "",
        "Summary",
        `Total Vehicles,${data.stats.total}`,
        `Average Price,${data.stats.avgPrice.toFixed(2)}`,
        `Average Kilometers,${data.stats.avgKm.toFixed(0)}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vehicle-report-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToJSON(data: ExportData) {
    const jsonContent = JSON.stringify(
        {
            exportDate: new Date().toISOString(),
            filters: data.filters,
            summary: data.stats,
            data: data.data,
        },
        null,
        2
    );

    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vehicle-report-${new Date().toISOString().split("T")[0]}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function exportToPDF(data: ExportData) {
    // Para PDF necesitaríamos una librería como jsPDF
    // Por ahora, exportamos como HTML que se puede imprimir como PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Vehicle Market Report</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #6366f1; color: white; }
        .summary { margin-top: 30px; padding: 20px; background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Vehicle Market Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    ${data.filters ? `<p>Filters: ${JSON.stringify(data.filters)}</p>` : ""}
    
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Vehicles: ${data.stats.total}</p>
        <p>Average Price: ${new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(data.stats.avgPrice)}</p>
        <p>Average Kilometers: ${Math.round(data.stats.avgKm).toLocaleString()} km</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Brand</th>
                <th>Year</th>
                <th>Kilometers</th>
            </tr>
        </thead>
        <tbody>
            ${data.data.slice(0, 100).map((item) => `
                <tr>
                    <td>${item.title || ""}</td>
                    <td>${new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(item.price || 0)}</td>
                    <td>${item.attributes?.brand || ""}</td>
                    <td>${item.attributes?.year || ""}</td>
                    <td>${item.attributes?.kilometers || 0}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vehicle-report-${new Date().toISOString().split("T")[0]}.html`;
    link.click();
    URL.revokeObjectURL(url);
}

