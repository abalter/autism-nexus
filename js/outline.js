function fillOutline(html_doc) {

  const parser = new DOMParser();
  let doc = parser.parseFromString(html_doc, 'text/html');

  console.log(`fillOutline: ${doc}`);
  // console.log(doc);

  // Access the DOM element where the outline will be displayed
  const outlineDiv = document.getElementById('article-outline');
  const sectionDiv = document.getElementById('article-section');

  // Assuming `doc` is your DOM object containing the parsed HTML document
  const sections = doc.querySelectorAll('section');
  console.log(`num sections: ${sections.length}`);

  // Iterate through each section to extract titles and set up the outline
  sections.forEach(section => {
    const title = section.querySelector('h1');
    if (title) {
      // Create a new div that will contain the title and act as a clickable element
      const titleDiv = document.createElement('div');
      titleDiv.textContent = title.innerHTML; // Set the text of the div to the title text
      titleDiv.style.cursor = 'pointer'; // Make it appear clickable

      // Add an event listener to this div
      titleDiv.addEventListener('click', () => {
        // When clicked, update the article-section div's content to this section's content
        sectionDiv.innerHTML = getContentExcludingH1(section);
      });

      // Append the title div to the outline div
      outlineDiv.appendChild(titleDiv);
    }
  });

}

// Function to copy content from a section excluding the <h1> element
function getContentExcludingH1(section) {
  // Clone the section to avoid modifying the original content
  const clonedSection = section.cloneNode(true);

  // Find the <h1> element in the cloned section
  const h1 = clonedSection.querySelector('h1');

  // Remove the <h1> if it exists
  if (h1) {
    h1.remove();
  }

  // Return the innerHTML of the modified clone
  return clonedSection.innerHTML;
}


