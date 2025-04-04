// app.js

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearBtn");
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");

let isDrawing = false;
let brushColor = "#000000"; // Default color is black
let brushSize = 5; // Default brush size

// Set canvas size
canvas.width = window.innerWidth * 0.8; // 80% of the window width
canvas.height = 400; // Fixed height for the canvas

// Handle the mouse down event to start drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  draw(e);
});

// Handle mouse move event to continue drawing
canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    draw(e);
  }
});

// Handle mouse up event to stop drawing
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.beginPath(); // Start a new path for the next drawing
});

// Handle touch events for mobile devices
canvas.addEventListener("touchstart", (e) => {
  isDrawing = true;
  draw(e.touches[0]);
});

canvas.addEventListener("touchmove", (e) => {
  if (isDrawing) {
    draw(e.touches[0]);
  }
});

canvas.addEventListener("touchend", () => {
  isDrawing = false;
  ctx.beginPath();
});

// Function to handle the drawing on the canvas
function draw(e) {
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;

  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Event listener for the color picker
colorPicker.addEventListener("input", (e) => {
  brushColor = e.target.value;
});

// Event listener for the brush size input
brushSizeInput.addEventListener("input", (e) => {
  brushSize = e.target.value;
});

// Clear the canvas when the button is clicked
clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
// Updated draw function
function draw(e) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = brushColor;
  
    // Check for mouse vs. touch event
    const rect = canvas.getBoundingClientRect(); // Get canvas bounding rectangle
    const x = e.clientX - rect.left; // Use rect.left for correct calculation
    const y = e.clientY - rect.top;  // Use rect.top for correct calculation
  
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  
  // Adding preventDefault to touchmove
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Prevent default action (scrolling)
    if (isDrawing) {
      draw(e.touches[0]);
    }
  });
  