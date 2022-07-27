document.addEventListener('DOMContentLoaded', () => {

    const mainGrid = document.querySelector('.main')
    const info = document.querySelector('.info')
    let squares = Array.from(document.querySelectorAll('.main .square'))
    const width = 10

    let previewSquares = Array.from(document.querySelectorAll('.preview .square'))
    const reviewWidth = 4

    // 200 elements form a grid `10 x 20` (thanks to layout)
    //  0   1   2   3   4   5   6   7   8   9
    // 10  11  12  13  14  15  16  17  18  19
    //...
    //190 191 192 193 194 195 196 197 198 199
    // this way we have oportutity to access element by №id squares[id]

    //a set of functions describing the general orientation of tetraminos in the grid
    //  0   1   2   3   ...
    // 10  11  12  13   ...
    // 20  21  22  23   ...
    // 30  11  32  33   ...
    // ...

    function get_L_Tetromino(width) {
        return [
            [1, width + 1, 2 * width + 1, 2],
            [width, width + 1, width + 2, 2 * width + 2],
            [1, width + 1, 2 * width + 1, 2 * width],
            [width, 2 * width, 2 * width + 1, 2 * width + 2]
        ]
    }
    function get_J_Tetromino(width) {
        return [
            [0, 1, width + 1, 2 * width + 1],
            [2 * width, 2 * width + 1, 2 * width + 2, width + 2],
            [1, width + 1, 2 * width + 1, 2 * width + 2],
            [width, width + 1, width + 2, 2 * width]
        ]
    }
    function get_Z_Tetromino(width) {
        return [
            [0, width, width + 1, 2 * width + 1],
            [width + 1, width + 2, 2 * width, 2 * width + 1],
            [0, width, width + 1, 2 * width + 1],
            [width + 1, width + 2, 2 * width, 2 * width + 1]
        ]
    }
    function get_S_Tetromino(width) {
        return [
            [1, width, width + 1, 2 * width],
            [width, width + 1, 2 * width + 1, 2 * width + 2],
            [1, width, width + 1, 2 * width],
            [width, width + 1, 2 * width + 1, 2 * width + 2]
        ]
    }
    function get_T_Tetromino(width) {
        return [
            [1, width, width + 1, width + 2],
            [1, width + 1, width + 2, 2 * width + 1],
            [width, width + 1, width + 2, 2 * width + 1],
            [1, width, width + 1, 2 * width + 1]
        ]
    }
    function get_II_Tetromino(width) {
        return [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ]
    }
    function get_I_Tetromino(width) {
        return [
            [1, width + 1, 2 * width + 1, 3 * width + 1],
            [width, width + 1, width + 2, width + 3],
            [1, width + 1, 2 * width + 1, 3 * width + 1],
            [width, width + 1, width + 2, width + 3]
        ]
    }

    const tetrominoes = [get_L_Tetromino(width), get_J_Tetromino(width), get_Z_Tetromino(width), get_S_Tetromino(width), get_T_Tetromino(width), get_II_Tetromino(width), get_I_Tetromino(width)]
    const tetrominoesPreview = [get_L_Tetromino(reviewWidth)[0], get_J_Tetromino(reviewWidth)[0], get_Z_Tetromino(reviewWidth)[0], get_S_Tetromino(reviewWidth)[0], get_T_Tetromino(reviewWidth)[0], get_II_Tetromino(reviewWidth)[0], get_I_Tetromino(reviewWidth)[0]]

    // tetromino always begins to move in the ~middle of grid 0 1 2 3 4 5 6 7 8 9
    const initPosition = 4
    let position = initPosition
    let orientation = 0

    let random = getRandom()
    let nextRandom = getRandom()

    let tetrominoDisposition = tetrominoes[random][orientation]
    let tetrominoPreviewDisposition = tetrominoesPreview[nextRandom]

    const scoreDisplay = document.querySelector('#score')
    let score = 0

    const speedDisplay = document.querySelector('#speed')
    const speeds = ['I', 'II', 'III']
    let level = 0
    let speed

    // control buttons
    const powerControl = document.querySelector('#power')
    const soundControl = document.querySelector('#soundControl')
    const controlStart = document.querySelector('#start')
    let timerId = null
    let pause = false
    //----------------------------

    // sounds
    const tetrisSound = document.querySelector("#tetrisSound")
    const successSound = document.querySelector("#successSound")
    const fallSound = document.querySelector("#fallSound")
    const rotationSound = document.querySelector("#rotationSound")
    const gameoverSound = document.querySelector("#gameoverSound")
    tetrisSound.loop = true
    //----------------------------

    // move control buttons
    const controlMoveLft = document.querySelector('#moveLft')
    const controlMoveRght = document.querySelector('#moveRght')
    const controlMoveDown = document.querySelector('#moveDown')
    const controlRotate = document.querySelector('#rotate')
    const controlSpeed = document.querySelector('#speedUp')
    //----------------------------

    document.addEventListener('keyup', keyControl)

    const spiralRanges = [
        generateRange(0, 9),
        generateRange(19, 199, 10),
        generateRange(198, 190, -1),
        generateRange(180, 10, -10),
    
        generateRange(11, 18),
        generateRange(28, 188, 10),
        generateRange(187, 181, -1),
        generateRange(171, 21, -10),
    
        generateRange(22, 27),
        generateRange(37, 177, 10),
        generateRange(176, 172, -1),
        generateRange(162, 32, -10),
    
        generateRange(33, 36),
        generateRange(46, 166, 10),
        generateRange(165, 163, -1),
        generateRange(153, 43, -10),
    
        generateRange(44, 45),
        generateRange(55, 155, 10),
        generateRange(154, 54, -10)
        ]

    const circlesRanges = [
        generateRange(0, 9),
        generateRange(19, 199, 10),
        generateRange(198, 190, -1),
        generateRange(180, 10, -10),
    
        // generateRange(11, 18),
        // generateRange(28, 188, 10),
        // generateRange(187, 181, -1),
        // generateRange(171, 21, -10),
    
        generateRange(22, 27),
        generateRange(37, 177, 10),
        generateRange(176, 172, -1),
        generateRange(162, 32, -10),
    
        // generateRange(33, 36),
        // generateRange(46, 166, 10),
        // generateRange(165, 163, -1),
        // generateRange(153, 43, -10),
    
        generateRange(44, 45),
        generateRange(55, 155, 10),
        generateRange(154, 54, -10)
    ]
    function generatePath(ranges){
        let path = []
        ranges.forEach( range => path = path.concat(range) )
        return path
    }
    // -------------------------------------------

    powerControl.addEventListener('click', () => {
        IsTetrisOn = powerControl.classList.contains("powerOn")
        // нажали кнопку выключения
        if (IsTetrisOn) {
            clearInterval(timerId)
            timerId = null
            powerControl.classList.remove("powerOn")
            powerControl.classList.add("powerOff")

            clearGrid()
            clearPreview()
            info.classList.add('disable')

            isPlaying = tetrisSound.classList.contains('playing')

            if (isPlaying) {
                tetrisSound.classList.remove('playing')
                tetrisSound.pause()
                tetrisSound.currentTime = 0
            }

        } else {
            // включить экран, сбросить игру
            powerControl.classList.remove("powerOff")
            info.classList.remove('disable')
            powerControl.classList.add("powerOn")
        }
    })

    controlStart.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            pause = true
        } else {
            speed = 650 / (level + 1)
            timerId = setInterval(moveDown, speed)
            showUpdatePreview()
            speedDisplay.innerHTML = `- ${speeds[level]} -`
        }
    })

    soundControl.addEventListener('click', () => {
        isPlaying = tetrisSound.classList.contains('playing')
        IsTetrisOn = powerControl.classList.contains("powerOn")

        if (IsTetrisOn) {
            if (!isPlaying) {
                tetrisSound.play()
                tetrisSound.classList.add('playing')
            } else {
                tetrisSound.pause()
                tetrisSound.currentTime = 0
                tetrisSound.classList.remove('playing')
            }
        }
    })

    function showUpdatePreview() {
        clearPreview()
        tetrominoPreviewDisposition = tetrominoesPreview[nextRandom]
        tetrominoPreviewDisposition.forEach(index => {
            previewSquares[index].classList.add('tetromino')
        })
    }
    function clearPreview() {
        tetrominoPreviewDisposition.forEach(index => {
            previewSquares[index].classList.remove('tetromino')
        })
    }
    function clearGrid() {
        squares.forEach(square => {
            square.classList.remove("tetromino")
            square.classList.remove("freezed")
        })
    }

    function draw() {
        if (timerId !== null) {
            tetrominoDisposition.forEach(index => {
                squares[position + index].classList.add('tetromino')
            })
        } else {
            alert('Click START button!')
        }

    }

    function undraw() {
        tetrominoDisposition.forEach(index => {
            squares[position + index].classList.remove('tetromino')
        })
    }

    function moveLeft() {
        if (!isFreezedTetromino()) {
            if (isAtLeft() || isTakenSquareAtLeft()) return
            undraw()
            position--
            draw()
        }
    }

    function moveRight() {
        if (!isFreezedTetromino()) {
            if (isAtRight() || isTakenSquareAtRight()) return
            undraw()
            position++
            draw()
        }
    }

    function moveDown() {
        if (!isFreezedTetromino()) {
            undraw()
            position += width
            draw()
            if (isAtBottom() || isTouchFreezedSquare()) {
                console.log('check left right movement')

                freezeCurrentTetrimino()
                updateScore()
                drawNextTetrimino()
                isGameOver()
            }
        }
    }

    function moveToBottom() {
        console.log(tetrominoDisposition, position)
    }

    function rotate() {
        if (!isFreezedTetromino()) {
            undraw()
            orientation++
            neworientation = orientation % tetrominoes[random].length
            tetrominoDisposition = tetrominoes[random][neworientation]
            checkRotatedPosition()
            rotationSound.play()
            draw()
        }
    }

    function keyControl(push) {
        if (push.keyCode === 38) {
            rotate()
        } else if (push.keyCode === 37) {
            moveLeft()
        } else if (push.keyCode === 39) {
            moveRight()
        } else if (push.keyCode === 40) {
            moveDown()
        } else if (push.keyCode === 32) {
            speedUp()
        } else if (push.keyCode === 13) {
            moveToBottom()
        }
    }
    
    controlMoveLft.addEventListener('click', () => { moveLeft() })
    controlMoveRght.addEventListener('click', () => { moveRight() })
    controlMoveDown.addEventListener('click', () => { moveDown() })
    controlRotate.addEventListener('click', () => { rotate() })
    controlSpeed.addEventListener('click', () => { speedUp() })

    function speedUp() {
        level++
        level = level % speeds.length
        speed = 850 / (level + 1)
        clearInterval(timerId)
        timerId = null
        timerId = setInterval(moveDown, speed)
        speedDisplay.innerHTML = `- ${speeds[level]} -`
    }

    function checkRotatedPosition() {
        if ((position + 1) % width < 4) {
            if (isAtRight()) position++
        }
        else if (position % width > 5) {
            if (isAtLeft()) position--
        }
    }

    function isAtRight() {
        return tetrominoDisposition.some(index => (position + index + 1) % width == 0)
    }

    function isAtLeft() {
        return tetrominoDisposition.some(index => (position + index) % width == 0)
    }

    function isAtBottom() {
        return tetrominoDisposition.some(index => position + index >= squares.length - width)
    }

    function isTakenSquareAtRight() {
        return tetrominoDisposition.some(index => squares[position + index + 1].classList.contains('freezed'))
    }

    function isTakenSquareAtLeft() {
        return tetrominoDisposition.some(index => squares[position + index - 1].classList.contains('freezed'))
    }

    function isFreezedTetromino() {
        return tetrominoDisposition.some(index => squares[position + index].classList.contains('freezed'))
    }

    function isTouchFreezedSquare() {
        return tetrominoDisposition.some(index => squares[position + index + width].classList.contains('freezed'))
    }

    function freezeCurrentTetrimino() {
        tetrominoDisposition.forEach(index => squares[position + index].classList.add('freezed'))
        fallSound.play()
    }

    function drawNextTetrimino() {
        position = initPosition
        orientation = 0
        random = nextRandom
        tetrominoDisposition = tetrominoes[random][orientation]

        nextRandom = Math.floor(Math.random() * tetrominoes.length)
        showUpdatePreview()

        draw()
    }

    function updateScore() {
        for (let rowId = 0; rowId <= squares.length - width; rowId += width) {
            const rowsSquares = [rowId + 0, rowId + 1, rowId + 2, rowId + 3, rowId + 4, rowId + 5, rowId + 6, rowId + 7, rowId + 8, rowId + 9]

            if (rowsSquares.every(index => squares[index].classList.contains('freezed'))) {
                successSound.play()
                score += width
                scoreDisplay.innerHTML = `- ${score} -`
                rowsSquares.forEach(index => {
                    squares[index].classList.remove('freezed')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(rowId, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(square => mainGrid.appendChild(square))
            }
        }
    }

    function isGameOver() {
        if (isFreezedTetromino()) {
            gameoverSound.play()
            drawPath(generatePath(spiralRanges))
        }
    }

    function generateRange(from, to, step = 1) {
        pathLength = (to - from) / step
        return Array(pathLength + 1).fill().map((_, idx) => from + step * idx)
    }

    function drawPath(path, method) {

        // the path is the sequence of indexes of square

        let id = 0
        let timerPath = setInterval(function () {
            if (id == path.length){
                clearInterval(timerPath)
                return
            }
            squares[path[id]].classList.add('tetromino')
            id ++
        }, 10)
    }

    function getRandom() {
        return Math.floor(Math.random() * tetrominoes.length)
    }
})
