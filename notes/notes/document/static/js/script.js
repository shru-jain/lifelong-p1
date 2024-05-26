function newNote() {
  const url = "/?docid=0"
  const csrftoken = getCookie('csrftoken');
  fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    console.log('New note done successfully');
    // Optionally, you can perform additional actions after the paragraph is updated
})
.catch(error => {
    console.error('Error opening new note:', error);
});
}

function updateParagraph(htmlElement) {
  // Construct the request data
  const newContent = htmlElement.innerHTML;

    // Construct the request data
  const csrftoken = getCookie('csrftoken');
  const requestData = new FormData();
  requestData.append('new_paragraph_content', newContent);
  console.log(newContent)


  // Make a fetch() POST request
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
      // Optionally, you can perform additional actions after the paragraph is updated
  })
  .catch(error => {
      console.error('Error updating paragraph:', error);
  });
}

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


      if (selectedText !== '') {
        var range = selection.getRangeAt(0);

        var rect = range.getBoundingClientRect();

        var highlightButton = document.createElement('button');
        highlightButton.innerText = 'Highlight';
        highlightButton.classList.add('highlight-button');
        highlightButton.classList.add('button');
        highlightButton.classList.add('is-small');
        highlightButton.style.position = 'absolute';
        highlightButton.style.left = rect.left + 'px';
        highlightButton.style.top = rect.top - 70 + 'px';
 
        document.getElementById('text-displayed').appendChild(highlightButton);

        var takeNoteButton = document.createElement('button');
        takeNoteButton.innerText = 'Add Note';
        takeNoteButton.classList.add('add-note-button');
        takeNoteButton.classList.add('button');
        takeNoteButton.classList.add('is-small');
        takeNoteButton.style.position = 'absolute';
        takeNoteButton.style.left = rect.left + 'px';
        takeNoteButton.style.top = rect.top - 35 + 'px';
        document.getElementById('text-displayed').appendChild(takeNoteButton);
        
        var doneButton = document.createElement('button');
        doneButton.innerText = 'Done';
        doneButton.classList.add('done-button');
        doneButton.classList.add('button');
        doneButton.classList.add('is-small');
        doneButton.style.position = 'absolute';
        doneButton.style.left = rect.left + 'px';
        doneButton.style.top = rect.top + 'px';
        document.getElementById('text-displayed').appendChild(doneButton);
        
        highlightButton.onclick = function(e) {
            var span = document.createElement('span');
            span.style.backgroundColor = 'yellow'; // Set background color to yellow for highlighting
            range.surroundContents(span);
            highlightButton.remove(); // Remove the button after clicking
            takeNoteButton.remove();
            doneButton.remove();
            updateParagraph(document.getElementById('text-displayed'));
            
        };

        highlightButton.addEventListener('mouseup', function(event) {
            event.stopPropagation();
        });

        takeNoteButton.onclick = function(e) {
          highlightButton.remove(); // Remove the button after clicking
          takeNoteButton.remove();
          doneButton.remove();

          // "{% url 'editor' %}?docid=0"
          // newNote();
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

    const summarizeButton = document.getElementById('summarizeButton') 

    summarizeButton.onclick = function (e) {
      console.log('going into the function')
      // Get the text from the textarea
      var text = document.querySelector('input.input[name="quote"]').value;
  
      // Make a POST request using Fetch API
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
          console.log("hereeeee")
          document.querySelector('textarea[name="content"]').value = data.summary;
      })
      .catch(error => {
          console.log('Error:', error);
      });
  };
  

    

  });
  