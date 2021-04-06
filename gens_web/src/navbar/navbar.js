// Navigation bar

function Navbar(props) {

  return (
    <div class="header">
    <div id='left-group'>
      <div id="logo-container">
        <span class='logo'></span>
      </div>
      <span class='version'>v{props.version}</span>
      <span class='date'>{props.date}</span>
    </div>
    <div id='center-group'>
      <span class='bold' title='Sample ID'>{props.sampleName}</span>
      <span class='version'>(Genome build: {props.hgType})</span>
    </div>
    <div id='right-group'>
      <span class='header-icon print no-print'
        onclick='loadPrintPage(inputField.value);' title='Print'>
      </span>
      <span class='header-icon permalink no-print'
        onclick='copyPermalink({props.hgType}, inputField.value);' title='Copy permalink'>
      </span>
      <span class='header-icon no-print info'></span>
    </div>
    </div>
  )
}

export default Navbar;
