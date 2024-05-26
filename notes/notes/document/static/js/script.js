function updateParagraph(htmlElement) {
  // construct the request data
  const newContent = htmlElement.innerHTML;
  const csrftoken = getCookie('csrftoken');
  const requestData = new FormData();
  requestData.append('new_paragraph_content', newContent);
  console.log(newContent)

  // make a fetch() POST request
  fetch('/update_paragraph/', {
      method: 'POST',
      body: requestData,
      headers: {
        'X-CSRFToken': csrftoken
    }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      console.log('Paragraph updated successfully');
  })
  .catch(error => {
      console.error('Error updating paragraph:', error);
  });
}

// used to get for csrf token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('text-displayed').addEventListener('mouseup', function() {
      var selection = window.getSelection();
      var selectedText = selection.toString().trim();
      // if non empty text is selected
      if (selectedText !== '') {
        var range = selection.getRangeAt(0);

        var rect = range.getBoundingClientRect();
        // create the highlight button
        var highlightButton = document.createElement('button');
        highlightButton.innerText = 'Highlight';
        highlightButton.classList.add('highlight-button');
        highlightButton.classList.add('button');
        highlightButton.classList.add('is-small');
        // position button above text
        highlightButton.style.position = 'absolute';
        highlightButton.style.left = rect.left + 'px';
        highlightButton.style.top = rect.top - 70 + 'px';
        // add the button
        document.getElementById('text-displayed').appendChild(highlightButton);
        // create the takeNote button
        var takeNoteButton = document.createElement('button');
        takeNoteButton.innerText = 'Add Note';
        takeNoteButton.classList.add('add-note-button');
        takeNoteButton.classList.add('button');
        takeNoteButton.classList.add('is-small');
        // position button above text
        takeNoteButton.style.position = 'absolute';
        takeNoteButton.style.left = rect.left + 'px';
        takeNoteButton.style.top = rect.top - 35 + 'px';
        document.getElementById('text-displayed').appendChild(takeNoteButton);
        
        // create the doneButton
        var doneButton = document.createElement('button');
        doneButton.innerText = 'Done';
        doneButton.classList.add('done-button');
        doneButton.classList.add('button');
        doneButton.classList.add('is-small');
        // position button above text
        doneButton.style.position = 'absolute';
        doneButton.style.left = rect.left + 'px';
        doneButton.style.top = rect.top + 'px';
        document.getElementById('text-displayed').appendChild(doneButton);
        
        // add the highlight
        highlightButton.onclick = function(e) {
            var span = document.createElement('span');
            span.style.backgroundColor = 'yellow'; // set background color to yellow for highlighting
            range.surroundContents(span);
            highlightButton.remove(); // remove the button after clicking
            takeNoteButton.remove();
            doneButton.remove();
            updateParagraph(document.getElementById('text-displayed'));
            
        };

        highlightButton.addEventListener('mouseup', function(event) {
            event.stopPropagation();
        });

        takeNoteButton.onclick = function(e) {
          // remove the buttons after clicking
          highlightButton.remove(); 
          takeNoteButton.remove();
          doneButton.remove();

          window.location.href = '/?docid=0&quote=' + encodeURIComponent(selectedText);
          var inputField = document.querySelector('#fieldToEdit input[name="quote"]');
          if (inputField) {
              inputField.value = selectedText;
          } else {
              console.error('Input field not found.');
          }
          console.log(document.getElementById("fieldToEdit"));
          console.log(inputField.value);

        };

      takeNoteButton.addEventListener('mouseup', function(event) {
          event.stopPropagation();
      });
      // remove buttons when done is clicked
      doneButton.onclick = function (e) {
        highlightButton.remove(); // Remove the button after clicking
        takeNoteButton.remove();
        doneButton.remove();

      };
      doneButton.addEventListener('mouseup', function(event) {
        event.stopPropagation();
      });
      }
    });
    // add summarizing functionality
    const summarizeButton = document.getElementById('summarizeButton') 

    summarizeButton.onclick = function (e) {
      console.log('going into the function')
      // Get the text from the textarea
      var text = document.querySelector('input.input[name="quote"]').value;
  
      // Make a POST request using fetch API
      fetch("/summarize_text/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ text: text })
      })
      .then(response => {
          if (!response.ok) {
              console.log('stuck')
              throw new Error('Network response was not ok');
              
          }
          return response.json();
      })
      .then(data => {
          // Update the textarea with the summary
          document.querySelector('textarea[name="content"]').value = data.summary;
      })
      .catch(error => {
          console.log('Error:', error);
      });
  };
  
  });
  