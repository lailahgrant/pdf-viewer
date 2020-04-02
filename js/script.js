var myState = {
      pdf: null, 
      currentPage: 1,
      zoom: 1
    }

    // At this point, we can load our pdf file by calling the `getDocument()` method of the `pdfjsLib`  object which runs asynchronously
    // Note that the getDocument() method internally uses an XMLHttpRequest object to load the PDF file. This means that the file must be present either on your own web server or on a server that allows cross-origin requests.
    PDFJS.getDocument('assets/input.pdf').then((pdf) => {

//Once the PDF file has been loaded successfully, we can update the pdf property of our state object.
    myState.pdf = pdf;

//Lastly, add a call to a function named render() so that our PDF viewer automatically renders the first page of the PDF file. We'll define the function in the next step render().

//Rendering a Page
//By calling the getPage() method of the pdf object and passing a page number to it, we can get a reference to any page inside the PDF file. For now, let's pass the currentPage property of our state object to it. This method too returns a promise, so we'll need a callback function to handle its result.
//Accordingly create a new function called `render()`.

  render();
  
    });

function render() {
    myState.pdf.getPage(myState.currentPage).then((page) => {

//To actually render a page, we must call the render() method of the page object available inside the callback. As arguments, the method expects the 2D context of our canvas and a PageViewport object, which we can get by calling the getViewport() method. Because the getViewport() method expects the desired zoom level as an argument, we must pass the zoom property of our state object to it.
    var canvas = document.getElementById("pdf_renderer");
    var ctx = canvas.getContext('2d');

    var viewport = page.getViewport(myState.zoom);
//The dimensions of the viewport depend on the original size of the page and the zoom level. In order to make sure that the entire viewport is rendered on our canvas, we must now change the size of our canvas to match that of the viewport.

      canvas.width = viewport.width;
      canvas.height = viewport.height;

//At this point, we can go ahead and render the page.

      page.render({
        canvasContext : ctx,
        viewport: viewport
      });

    });
  }

//Changing the Current Page
//Our JavaScript PDF viewer is currently capable of showing only the first page of any PDF file given to it. To allow users to change the page being rendered, we must now add click event listeners to the go_previous and go_next buttons we created earlier.
//Inside the event listener of the go_previous button, we must decrement the currentPage property of our state object, making sure that it doesn't fall below 1. After we do so, we can simply call the render() function again to render the new page.
//Additionally, we must update the value of the current_page text field so that it displays the new page number. The following code shows you how:
  document.getElementById('go_previous')
        .addEventListener('click', (e) => {
            if(myState.pdf == null
               || myState.currentPage == 1) return;
            myState.currentPage -= 1;
            document.getElementById("current_page")
                    .value = myState.currentPage;
            render();
        });


//Similarly, inside the event listener of the go_next button, we must increment the currentPage property while ensuring that it doesn't exceed the number of pages present in the PDF file, which we can determine using the numPages property of the _pdfInfo object.
  document.getElementById('go_next')
        .addEventListener('click', (e) => {
            if(myState.pdf == null
               || myState.currentPage > myState.pdf
                                               ._pdfInfo.numPages) 
               return;
         
            myState.currentPage += 1;
            document.getElementById("current_page")
                    .value = myState.currentPage;
            render();
        });

//Lastly, we must add a key press event listener to the current_page text field so that users can directly jump to any page they desire by simply typing in a page number and hitting the Enter key. Inside the event listener, we need to make sure that the number the user has entered is both greater than zero and less than or equal to the numPages property.
  document.getElementById('current_page').addEventListener('keypress', (e) => {
    if(myState.pdf == null) return;
         
            // Get key code
            var code = (e.keyCode ? e.keyCode : e.which);
         
            // If key code matches that of the Enter key
            if(code == 13) {
                var desiredPage = 
                        document.getElementById('current_page')
                                .valueAsNumber;
                                 
                if(desiredPage >= 1 
                   && desiredPage <= myState.pdf
                                            ._pdfInfo.numPages) {
                        myState.currentPage = desiredPage;
                        document.getElementById("current_page")
                                .value = desiredPage;
                        render();
                }
            }
        });

  document.getElementById('zoom_in')
        .addEventListener('click', (e) => {
            if(myState.pdf == null) return;
            myState.zoom += 0.5;
            render();
        });

        document.getElementById('zoom_out')
        .addEventListener('click', (e) => {
            if(myState.pdf == null) return;
            myState.zoom -= 0.5;
            render();
        });