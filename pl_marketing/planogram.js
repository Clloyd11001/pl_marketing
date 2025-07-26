let sorted = false;
// products array (exported for external use if needed)
const products = [
    { brand: "A", color: "Pure Green", salesRank: 2 },
    { brand: "B", color: "Blue", salesRank: 3 },
    { brand: "C", color: "Green", salesRank: 1 },
    { brand: "D", color: "Yellow", salesRank: 10 },
    { brand: "E", color: "Brown", salesRank: 6 },
    { brand: "F", color: "Orange", salesRank: 5 },
];

// Helper: place items starting from center outward
function arrangeCenterOut(products) {
    const planogram = Array(products.length).fill(null);
    let left = Math.floor((products.length - 1) / 2);
    let right = left + 1;
    let toggle = true;

    for (let i = 0; i < products.length; i++) {
        if (toggle) {
            planogram[left--] = products[i];
        } else {
            planogram[right++] = products[i];
        }
        toggle = !toggle;
    }

    return planogram;
}

function createPlanogram(products) {
    const sortedBySales = [...products].sort((a, b) => a.salesRank - b.salesRank);
    return arrangeCenterOut(sortedBySales);
}

// Converts 1D array to 2D grid with rows x cols
function toGrid(products, rows, cols) {
    const grid = [];
    for (let r = 0; r < rows; r++) {
        grid.push(products.slice(r * cols, (r + 1) * cols));
    }
    return grid;
}

/**
 * Renders the grid inside the container and animates moves using FLIP.
 * @param {Array} grid 2D array of products
 * @param {HTMLElement} container DOM element to render into
 * @param {Map|null} oldRects Map of data-key to previous DOMRect for FLIP animation (optional)
 */
function renderGrid(grid, container, oldRects = null) {
    if (!oldRects) {
        oldRects = new Map();
        const oldCells = Array.from(container.querySelectorAll("td"));
        oldCells.forEach((cell) => {
            const key = cell.dataset.key;
            if (key) {
                oldRects.set(key, cell.getBoundingClientRect());
            }
        });
    }

    // Clear and re-render the grid
    let html = "<table>";
    grid.forEach((row) => {
        html += "<tr>";
        row.forEach((product) => {
            let src = "";
            if (product) {
                switch (product.color.toLowerCase()) {
                    case "black":
                        src = "images/black_soda.png";
                        break;
                    case "blue":
                        src = "images/blue_soda.png";
                        break;
                    case "brown":
                        src = "images/brown_soda.png";
                        break;
                    case "green":
                        src = "images/green_soda.png";
                        break;
                    case "orange":
                        src = "images/orange_soda.png";
                        break;
                    case "pure green":
                        src = "images/pure_green_soda.png";
                        break;
                    case "yellow":
                        src = "images/yellow_soda.png";
                        break;
                    default:
                        break;
                }

                const key = `${product.brand}-${product.color}`;

                html += `
    <td data-key="${key}">
        <img src="${src}" style="width:60px; height:auto; margin-top:8px; display:block;">
    </td>`;

            } else {
                html += "<td></td>";
            }
        });
        html += "</tr>";
    });
    html += "</table>";
    container.innerHTML = html;

    // Animate movement using FLIP
    requestAnimationFrame(() => {
        const newCells = Array.from(container.querySelectorAll("td"));
        newCells.forEach((cell) => {
            const key = cell.dataset.key;
            if (!key) return;

            const oldRect = oldRects.get(key);
            const newRect = cell.getBoundingClientRect();

            if (oldRect) {
                const dx = oldRect.left - newRect.left;
                const dy = oldRect.top - newRect.top;

                cell.style.transform = `translate(${dx}px, ${dy}px)`;
                cell.style.transition = "none";

                requestAnimationFrame(() => {
                    cell.style.transition = "transform 500ms ease";
                    cell.style.transform = "translate(0, 0)";
                });
            }
        });
    });
}

function generateUnsorted(rows = 3, cols = 3, containerId = "original-planogram-container") {
    const container = document.getElementById(containerId);
    const selected = products.slice(0, rows * cols);
    const grid = toGrid(selected, rows, cols);
    renderGrid(grid, container);
}

function renderPlanogramWithAnimation(rows = 3, cols = 3, sortedState = false) {
    const container = document.getElementById("revised-planogram-container");
    const totalSpots = rows * cols;
    const selectedProducts = products.slice(0, totalSpots);
    let layout;

    if (sortedState) {
        layout = createPlanogram(selectedProducts);
    } else {
        layout = selectedProducts;
    }

    const grid = toGrid(layout, rows, cols);
    renderGrid(grid, container);
}

function handleGenerateClick() {
    if (!sorted) {
        // Show sorted (flipped)
        renderPlanogramWithAnimation(3, 3, true);
        const btn = document.getElementById('generate-btn');
        btn.textContent = "Revert back to Unsorted"
    } else {
        // Show unsorted (flipped back)
        renderPlanogramWithAnimation(3, 3, false);
    }
    sorted = !sorted;
}

function generatePlanogram(rows = 3, cols = 3) {
    toggleSorted();
    const container = document.getElementById("revised-planogram-container");

    // Capture old positions before rendering the revised planogram
    const oldCells = Array.from(container.querySelectorAll("td"));
    const oldRects = new Map();
    oldCells.forEach((cell) => {
        const key = cell.dataset.key;
        if (key) {
            oldRects.set(key, cell.getBoundingClientRect());
        }
    });

    const totalSpots = rows * cols;
    const selectedProducts = products.slice(0, totalSpots);
    const layout = createPlanogram(selectedProducts);
    const grid = toGrid(layout, rows, cols);

    renderGrid(grid, container, oldRects);
}

// Expose to window for HTML access
window.generatePlanogram = generatePlanogram;
window.generateUnsorted = generateUnsorted;

window.addEventListener("DOMContentLoaded", () => {
    generateUnsorted(3, 3, 'original-planogram-container');
    generateUnsorted(3, 3, 'revised-planogram-container');

    const generateBtn = document.getElementById("generate-btn");
    generateBtn.addEventListener("click", handleGenerateClick);
});
export { products };
