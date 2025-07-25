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

function renderGrid(grid, container) {
    const oldCells = Array.from(container.querySelectorAll('td'));
    const oldRects = new Map();
    
    oldCells.forEach(cell => {
        const key = cell.dataset.key;
        if (key) {
            oldRects.set(key, cell.getBoundingClientRect());
        }
    });

    // Clear and re-render the grid
    let html = '<table>';
    grid.forEach((row, rowIndex) => {
        html += '<tr>';
        row.forEach((product, colIndex) => {
            let src = '';
            if (product) {
                switch (product.color.toLowerCase()) {
                    case "black":
                        src = 'images/black_soda.png'; break;
                    case "blue":
                        src = 'images/blue_soda.png'; break;
                    case "brown":
                        src = 'images/brown_soda.png'; break;
                    case "green":
                        src = 'images/green_soda.png'; break;
                    case "orange":
                        src = 'images/orange_soda.png'; break;
                    case "pure green":
                        src = 'images/pure_green_soda.png'; break;
                    case "yellow":
                        src = 'images/yellow_soda.png'; break;
                    default: break;
                }

                const key = `${product.brand}-${product.color}`;

                html += `
                    <td data-key="${key}">
                        <img src="${src}" style="width:60px;height:auto;margin-top:8px;">
                    </td>`;
            } else {
                html += '<td></td>';
            }
        });
        html += '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;

    // Animate movement using FLIP
    requestAnimationFrame(() => {
        const newCells = Array.from(container.querySelectorAll('td'));
        newCells.forEach(cell => {
            const key = cell.dataset.key;
            if (!key) return;

            const oldRect = oldRects.get(key);
            const newRect = cell.getBoundingClientRect();

            if (oldRect) {
                const dx = oldRect.left - newRect.left;
                const dy = oldRect.top - newRect.top;

                cell.style.transform = `translate(${dx}px, ${dy}px)`;
                cell.style.transition = 'none';

                requestAnimationFrame(() => {
                    cell.style.transition = 'transform 500ms ease';
                    cell.style.transform = 'translate(0, 0)';
                });
            }
        });
    });
}

function generateUnsorted() {
    const container = document.getElementById('planogram-container');
    const selected = products.slice(0, 9);
    const grid = toGrid(selected, 3, 3);
    renderGrid(grid, container);
}

// Main function to generate and display planogram grid
function generatePlanogram(rows = 3, cols = 3) {
    const container = document.getElementById("planogram-container");
    const totalSpots = rows * cols;
    const selectedProducts = products.slice(0, totalSpots);
    const layout = createPlanogram(selectedProducts);
    const grid = toGrid(layout, rows, cols);
    renderGrid(grid, container);
}

// Expose functions or variables you want accessible in HTML
window.generatePlanogram = generatePlanogram;
window.generateUnsorted = generateUnsorted;

window.addEventListener("DOMContentLoaded", () => {
    generateUnsorted();

    const generateBtn = document.getElementById("generate-btn");
    generateBtn.addEventListener("click", () => {
        generatePlanogram();
    });
});
export { products };
