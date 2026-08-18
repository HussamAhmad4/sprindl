export default function Footer({ minimal }) {
  if (minimal) return (
    <footer className="app-footer app-footer--minimal">
      <p>
        Sprindl is an independent, student-built platform and is not affiliated with or endorsed by the
        College of Staten Island or CUNY. Information is provided for general guidance only — always
        confirm details with the official office or program.
      </p>
    </footer>
  )
  return (
    <footer className="app-footer">
      <p>
        Sprindl is an independent, student-built platform and is not affiliated with or endorsed by the
        College of Staten Island or CUNY. Information is provided for general guidance only — always
        confirm details with the official office or program.
        Crisis support: <strong>988</strong> · Text HOME to <strong>741741</strong>
      </p>
    </footer>
  )
}
