var htmlCardPartial = 
`
  <h4 class="card-name">[[FIRSTNAME]]</h4>
  <h6 class="card-state">[[STATE]]</h6>
  <center><img class="u-max-full-width card-image" [[IMAGE]]></center>
  <div class="container">
    <div class="row">
      <p class="one-half column card-label">Party:</p>
      <p class="one-half column card-description">[[PARTY]]</p>
    </div>
    <hr>
    <div class="row">
      <p class="one-half column card-label">Information:</p>
      <a href="[[WEBSITE]]" target="_blank" class="one-half column card-description">[[WEBSITE_DESC]]</a>
    </div>
  </div>
`;