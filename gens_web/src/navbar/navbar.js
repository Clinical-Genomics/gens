// Navigation bar

function Navbar() {
  return (
    <div class="header">
    <div id='left-group'>
      <div id="logo-container">
        <span class='logo'></span>
      </div>
      <span class='version'>v{{ version }}</span>
      <span class='date'>{{todays_date}}</span>
    </div>
    <div id='center-group'>
      <span class='bold' title='Sample ID'>{{sample_name}}</span>
      <span class='version'>(Genome build: {{hg_type}})</span>
    </div>
    <div id='right-group'>
      <span class='header-icon print no-print'
        onclick='loadPrintPage(inputField.value);' title='Print'>
      </span>
      <span class='header-icon permalink no-print'
        onclick='copyPermalink("{{hg_type}}", inputField.value);' title='Copy permalink'>
      </span>
      <span class='header-icon no-print info'></span>
    </div>
    </div>
  )
}

export default Navbar;
