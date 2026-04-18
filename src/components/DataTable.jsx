function DataTable({ columns, data }) {

    return (

        <table>

            <thead>
                <tr>

                    {columns.map(col => (
                        <th key={col.header}>
                            {col.header}
                        </th>
                    ))}

                </tr>
            </thead>

            <tbody>

                {data?.map((row, index) => (

                    <tr key={index}>

                        {columns.map(col => (

                            <td key={col.header}>
                                {col.render
                                    ? col.render(row)
                                    : row[col.field]}
                            </td>

                        ))}

                    </tr>

                ))}

            </tbody>

        </table>

    );
}

export default DataTable;