import React from "react"

// the header or the footer etc. can go here, i.e. the same components that would be rendered in many places
const MainLayout: React.FC = ({ children }) => (
  <div>
    {children}
  </div>
)

export default MainLayout
