class Annotation extends Track {
  constructor (x, width, near, far, hgType, defaultAnnotation) {
    // Dimensions of track canvas
    const visibleHeight = 300; // Visible height for expanded canvas, overflows for scroll
    const minHeight = 35; // Minimized height

    super(width, near, far, visibleHeight, minHeight);

    // Set inherited variables
    // TODO use the names contentCanvas and drawCanvas
    this.trackCanvas = document.getElementById('annotation-content');
    this.trackTitle = document.getElementById('annotation-titles');
    this.trackContainer = document.getElementById('annotation-container');
    this.staticCanvas = document.getElementById('annotation-draw');
    this.featureHeight = 18;
    this.arrowThickness = 2;

    this.offScreenPosition = {start: 1, end: null};

    // Setup html objects now that we have gotten the canvas and div elements
    this.setupHTML(x + 1);

    this.trackContainer.style.marginTop = '-1px';
    this.hgType = hgType;

    // Setup annotation list
    this.sourceList = document.getElementById('source-list');
    this.sourceList.addEventListener('change', () => {
      this.expanded = false;
      this.drawTracks(document.getElementById('region_field').value);
    })
    this.annotSourceList(defaultAnnotation);
  }

  // Fills the list with source files
  annotSourceList (defaultAnntotation) {
    $.getJSON($SCRIPT_ROOT + '/api/get-annotation-sources', {
      hg_type: this.hgType
    }, (result) => {
      if(result['sources'].length > 0) {
        this.sourceList.style.visibility = 'visible';
      }

      for (let i = 0; i < result['sources'].length; i++) {
        // Add annotation file name to list
        let opt = document.createElement('option');
        const file_name = result['sources'][i];
        opt.value = file_name;
        opt.innerHTML = file_name;

        // Set mimisbrunnr as default file
        if (file_name.match(defaultAnntotation)) {
          opt.setAttribute('selected', true);
        }
        this.sourceList.appendChild(opt);
      }
    }).done((result) => {
      this.drawTracks(document.getElementById('region_field').value);
    });
  }

  // Get annotation data
  async getTrackData(region) {
    const urlParams = objectToQueryString({
      region: region,
      hg_type: this.hgType,
      source: this.sourceList.value,
      collapsed: this.expanded ? false : true})
    const response = await fetch($SCRIPT_ROOT + '/api/get-annotation-data?' + urlParams, {
      method: 'GET',
    });
    if (response.status !== 200) {
      return {status: 'error', message: 'The server responded with an error'}
    }
    const result = await response.json();
    return result;
  }

  // WIP blitting code
  async drawTracks(region) {
    // TODO migrate from region sting to object
    const chromosome = region.split(':')[0];
    let [start, end] = region.split(':')[1].split('-');
    start = parseInt(start);
    end = parseInt(end);
    //  verify that either data is loaded or the right chromosome is loaded
    if ( !this.trackData || this.trackData !== chromosome ) {
      this.trackData = await this.getTrackData(chromosome + ':1-None');
    }
    // render
    if ( start < this.offScreenPosition.start + 100 || this.offScreenPosition.end - 100 < end ) {
      // blit image
      this.blitCanvas(start, end);
    } else {
      // redraw image
      width = end - start + 1
      drawOffScreenTracks(`${chromosome}:${start - (width / 2)}-${end + (width / 2)}`)
      this.blitCanvas(start, end)
    }
  }

  blitCanvas(start, end) {
    // blit drawCanvas to content canvas.
    const width = end - start + 1;
    const context = this.staticCanvas.getContext('2d');

    //context.clearRect(0, 0, this.staticCanvas.width, this.staticCanvas.height);
    context.drawImage(this.trackCanvas, 0, 0)
    // context.drawImage(
    //   this.contentCanvas,  // image
    //   (start - this.offScreenPosition.start) + 1,  // sx
    //   0,  // sy
    //   width,  // swidth
    //   this.maxHeight,  // sheight
    //   0,  // dx
    //   0,  // dy
    //   width,  // dWidth
    //   this.maxHeight,  //dHeight
    // );
  }

  // Draws annotations in given range
  async drawOffScreenTracks(region) {
    const scale = this.trackCanvas.width / (this.trackData.end_pos - this.trackData.start_pos);
    const textSize = 10;

    // Set needed height of visible canvas and transcript tooltips
    this.setContainerHeight(this.trackData['max_height_order']);

    // Keeps track of previous values
    let latest_height = 0; // Latest height order for annotation
    let latest_name_end = 0; // Latest annotations end position
    let latest_track_end = 0; // Latest annotations title's end position

    this.clearTracks();

    // Go through results and draw appropriate symbols
    for (let i = 0; i < this.trackData.annotations.length; i++) {
      const track = this.trackData['annotations'][i];
      const annotationName = track['name'];
      const chrom = track['chrom'];
      const height_order = track['height_order'];
      const score = track['score'];
      const start = track['start'];
      const end = track['end'];
      const strand = track['strand'];
      const color = track['color'];
      const canvasYPos = this.tracksYPos(height_order);

      // Only draw visible tracks
      if (!this.expanded && height_order != 1) {
        continue
      }

      // Keep track of latest annotations
      if (latest_height != height_order) {
        latest_height = height_order;
        latest_name_end = 0;
        latest_track_end = 0;
      }

      // Draw box for annotation
      this.drawBox(
        scale * (start - this.trackData['start_pos']),
        canvasYPos, scale * (end - start),
        this.featureHeight / 2, color
      );

      // Draw annotation name
      const textYPos = this.tracksYPos(height_order);
      latest_name_end = this.drawText(annotationName,
        scale * ((start + end) / 2 - this.trackData['start_pos']),
        textYPos + this.featureHeight, textSize, latest_name_end);

      // Set tooltip text
      const geneText = annotationName + '\n' + 'chr' + chrom + ':' + start + '-' + end + '\n' + 'Score = ' + score;

      // Add tooltip title for whole gene
      latest_track_end = this.hoverText(geneText,
        scale * (start - this.trackData['start_pos']) + 'px',
        textYPos - this.featureHeight / 2 + 'px',
        scale * (end - start) + 'px',
        this.featureHeight + textSize + 'px',
        0, latest_height);

      // Draw arrows
      if (strand) {
        let direction = strand == '+' ? 1 : -1;
        this.drawArrows(scale * (start - this.trackData['start_pos']),
          scale * (end -
this.trackData['start_pos']), canvasYPos, direction,
          this.arrowColor);
      }
    }
  }
}
