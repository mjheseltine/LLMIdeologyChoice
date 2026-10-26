/* Paste into the JavaScript editor for a Qualtrics Text/Graphic question.
   Replace YOUR_USERNAME and YOUR_REPO with your GitHub Pages URL.
   Create Embedded Data fields in Survey Flow first: llm_results, llm_score, llm_total, llm_complete.
*/
Qualtrics.SurveyEngine.addOnload(function () {
  var q = this;
  var url = 'https://YOUR_USERNAME.github.io/YOUR_REPO/';
  var container = q.getQuestionContainer();
  var frame = document.createElement('iframe');
  frame.src = url;
  frame.title = 'LLM identification experiment';
  frame.style.cssText = 'width:100%;height:850px;border:0;display:block;';
  frame.setAttribute('scrolling', 'auto');
  container.appendChild(frame);
  q.hideNextButton();
  function receive(event) {
    if (event.origin !== new URL(url).origin || event.source !== frame.contentWindow) return;
    var d = event.data;
    if (!d || d.type !== 'llmExperimentComplete' || !Array.isArray(d.results) || d.results.length !== 8) return;
    Qualtrics.SurveyEngine.setEmbeddedData('llm_results', JSON.stringify(d.results));
    Qualtrics.SurveyEngine.setEmbeddedData('llm_score', String(d.score));
    Qualtrics.SurveyEngine.setEmbeddedData('llm_total', String(d.total));
    Qualtrics.SurveyEngine.setEmbeddedData('llm_complete', '1');
    q.showNextButton();
    frame.style.height = '260px';
  }
  window.addEventListener('message', receive);
  q._llmCleanup = function () { window.removeEventListener('message', receive); };
});
Qualtrics.SurveyEngine.addOnUnload(function () { if (this._llmCleanup) this._llmCleanup(); });
