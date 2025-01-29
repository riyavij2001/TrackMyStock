package utils

import (
	"bytes"
	"html/template"

	"github.com/riyavij2001/TrackMyStock/types"
)

type StockData struct {
	SectorStocks  types.SectorStocks
	RecipientName string
}

func RenderTemplate(sectors types.SectorStocks, recipientName string) (string, error) {
	// Define the template structure
	// Define the template structure
	tmpl, err := template.New("emailTemplate").Parse(`
		<html>
		<head>
			<style>
				table {
					width: 100%;
					border-collapse: collapse;
				}
				table, th, td {
					border: 1px solid black;
				}
				th, td {
					padding: 8px;
					text-align: left;
				}
			</style>
		</head>
		<body>
			<h1>{{.RecipientName}} Portfolio Status</h1>
			{{range $sector, $stocks := .SectorStocks}}
				<h2>{{$sector}}</h2>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Date</th>
							<th>Code</th>
							<th>Close</th>
							<th>Altman</th>
							<th>Sloan</th>
							<th>FScore</th>
						</tr>
					</thead>
					<tbody>
						{{range $stocks}}
							<tr>
								<td>{{.ID}}</td>
								<td>{{.Date.Format "2006-01-02"}}</td>
								<td>{{.Code}}</td>
								<td>{{.Close}}</td>
								<td>{{.Altman}}</td>
								<td>{{.Sloan}}</td>
								<td>{{.FScore}}</td>
							</tr>
						{{end}}
					</tbody>
				</table>
			{{end}}
		</body>
		</html>
	`)
	if err != nil {
		return "", err
	}

	// Prepare the data
	data := StockData{
		SectorStocks:  sectors,
		RecipientName: recipientName,
	}

	// Create a file or use an in-memory buffer
	var htmlContent bytes.Buffer
	err = tmpl.Execute(&htmlContent, data)
	if err != nil {
		return "", err
	}

	return htmlContent.String(), nil
}
