def generate_spiral_coords(rows: int, cols: int):
    """Generate coordinates for a spiral traversal.

    Parameters
    ----------
    rows: int
        Number of rows in the grid.
    cols: int
        Number of columns in the grid.

    Returns
    -------
    list[tuple[int, int, int]]
        List of tuples ``(row, col, index)`` for each cell in the order
        visited by the spiral traversal.
    """
    coords = []
    top, bottom = 0, rows - 1
    left, right = 0, cols - 1
    index = 1

    while top <= bottom and left <= right:
        # Traverse from left to right along the top row
        for col in range(left, right + 1):
            coords.append((top, col, index))
            index += 1
        top += 1

        # Traverse from top to bottom along the right column
        for row in range(top, bottom + 1):
            coords.append((row, right, index))
            index += 1
        right -= 1

        if top <= bottom:
            # Traverse from right to left along the bottom row
            for col in range(right, left - 1, -1):
                coords.append((bottom, col, index))
                index += 1
            bottom -= 1

        if left <= right:
            # Traverse from bottom to top along the left column
            for row in range(bottom, top - 1, -1):
                coords.append((row, left, index))
                index += 1
            left += 1

    return coords


def create_spiral_svg(rows: int, cols: int, cell_size: int = 50, filename: str = "spiral.svg"):
    """Create an SVG of the spiral grid using ``svgwrite``."""
    # Import here so that calling :func:`generate_spiral_coords` does not require
    # the svgwrite package.
    import svgwrite

    coords = generate_spiral_coords(rows, cols)
    width, height = cols * cell_size, rows * cell_size
    dwg = svgwrite.Drawing(filename, size=(width, height))

    for row, col, index in coords:
        x, y = col * cell_size, row * cell_size
        rect = dwg.rect((x, y), (cell_size, cell_size),
                        fill="white", stroke="black")
        dwg.add(rect)
        dwg.add(dwg.text(
            str(index),
            insert=(x + cell_size / 2, y + cell_size / 2),
            text_anchor="middle",
            alignment_baseline="middle",
            font_size=cell_size / 3,
        ))

    dwg.save()


if __name__ == "__main__":
    # Example usage: generate a 5x5 spiral
    create_spiral_svg(5, 5, cell_size=40, filename="spiral_example.svg")
