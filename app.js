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

    function get_L_Tetromino(width) {
        return [
            [1, width + 1, 2 * width + 1, 2],
            [width, width + 1, width + 2, 2 * width + 2],
            [1, width + 1, 2 * width + 1, 2 * width],
            [0, width, width + 1, width + 2]
        ]
    }
    function get_J_Tetromino(width) {
        return [
            [0, 1, width + 1, 2 * width + 1],
            [width, width + 1, width + 2, 2],
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

    // tetromino always begins to move in the ~middle of grid 0 ... |4| ... 9
    const initPosition = 4
    let position = initPosition
    let orientation = 0
    let random = getRandom()
    let nextRandom = getRandom()
    let tetrominoDisposition = tetrominoes[random][orientation]
    let tetrominoPreviewDisposition = tetrominoesPreview[nextRandom]

    const scoreDisplay = document.querySelector('#score')
    let score = 0

    const levelDisplay = document.querySelector('#level')
    const levels = ['', '*', '**', '***', '****', '*****']
    let level = 0
    let levelWeight = 200
    let speedLevel = 0

    // indicators
    const pauseIndicator = document.querySelector("#pauseIndicator")
    const soundIndicator = document.querySelector("#soundIndicator")
    const resetIndicator = document.querySelector("#resetIndicator")
    //----------------------------

    // control buttons
    const powerControl = document.querySelector('#powerControl')
    const soundControl = document.querySelector('#soundControl')
    const startControl = document.querySelector('#startControl')

    let timerId = null
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

    function getSpiral() {
        let spiral = []
        for (let i = 0; i < 5; i++) {
            spiral = spiral.concat(generateRange(11 * i, 9 * (1 + i), 1))
            spiral = spiral.concat(generateRange(10 + 9 * (1 + i), 199 - 11 * i, 10))
            spiral = spiral.concat(generateRange(198 - 11 * i, 190 - 9 * i, -1))
            spiral = spiral.concat(generateRange(180 - 9 * i, 10 + 11 * i, -10))
        }
        return spiral
    }
    const spiral = getSpiral()
    // -------------------------------------------

    powerControl.addEventListener('click', () => {
        IsTetrisOn = powerControl.classList.contains("powerOn")
        // нажали кнопку выключения при включенном тетрисе
        if (IsTetrisOn) {
            //off
            powerControl.classList.remove("powerOn")
            powerControl.classList.add("powerOff")

            clearInterval(timerId)
            timerId = null

            clearGrid()
            clearPreview()
            levelDisplay.innerHTML = ''
            scoreDisplay.innerHTML = ''

            isPlaying = !soundIndicator.classList.contains('disable')
            if (isPlaying) {
                tetrisSound.pause()
                tetrisSound.currentTime = 0
                soundIndicator.classList.add('disable')
            }
            disableIndicators()
        } else {
            powerControl.classList.remove("powerOff")
            powerControl.classList.add("powerOn")
            levelDisplay.innerHTML = levels[level]
            scoreDisplay.innerHTML = score
        }
    })

    startControl.addEventListener('click', () => {
        IsTetrisOn = powerControl.classList.contains("powerOn")
        if (!IsTetrisOn) return

        if (timerId) {
            clearInterval(timerId)
            timerId = null
            pauseIndicator.classList.remove('disable')
            if (!isSoundIndicatorDisable()) {
                tetrisSound.pause()
                soundIndicator.classList.add('disable')
            }
        } else {
            timerId = setInterval(moveDown, 850 / (speedLevel + 1))
            showUpdatePreview()
            pauseIndicator.classList.add('disable')
        }
    })

    soundControl.addEventListener('click', () => {
        isNotPlaying = soundIndicator.classList.contains('disable')
        IsTetrisOn = powerControl.classList.contains("powerOn")

        if (IsTetrisOn) {
            if (isNotPlaying) {
                tetrisSound.play()
                soundIndicator.classList.remove('disable')
            } else {
                tetrisSound.pause()
                //tetrisSound.currentTime = 0
                soundIndicator.classList.add('disable')
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
    function fillGrid() {
        squares.forEach(square => {
            square.classList.add("tetromino")
        })
    }
    function draw() {
        IsTetrisOn = powerControl.classList.contains("powerOn")
        if (!IsTetrisOn) return

        //squares[position].classList.add('tetrominoL')

        if (timerId !== null) {
            tetrominoDisposition.forEach(index => {
                squares[position + index].classList.add('tetromino')
            })
        } else {
            alert('Click START button!')
        }

    }

    function undraw() {
        IsTetrisOn = powerControl.classList.contains("powerOn")
        if (!IsTetrisOn) return

        //squares[position].classList.remove('tetrominoL')

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

    function moveDown(step = width) {
        if (!isFreezedTetromino()) {
            undraw()
            position += step
            draw()
            if (isAtBottom() || isTouchFreezedSquare()) {
                freezeCurrentTetrimino()
                updateScore()
                drawNextTetrimino()
                if (isFreezedTetromino()) gameOver()
            }
        }
    }

    function moveToBottom() {
        console.log('move to bottom')
    }
    function rotate() {
        if (!isFreezedTetromino()) {
            undraw()
            orientation++
            neworientation = orientation % tetrominoes[random].length
            tetrominoDisposition = tetrominoes[random][neworientation]
            checkRotatedPosition() // TO DO
            if (!isSoundIndicatorDisable()) rotationSound.play()
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
        IsTetrisOn = powerControl.classList.contains("powerOn")
        if (!IsTetrisOn || !timerId) return

        clearInterval(timerId)
        timerId = null
        speedLevel++
        speedLevel = speedLevel % 3
        timerId = setInterval(moveDown, 850 / (speedLevel + 1))
    }

    function checkRotatedPosition(P){
        P = P || position
        if ((P+1) % width < 4) {
          if (isAtRight()){
            position++
            checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            position--
            checkRotatedPosition(P)
          }
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
        if (!isSoundIndicatorDisable()) fallSound.play()
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
        const cleanDelay = 30
        for (let rowId = 0; rowId < squares.length / width; rowId++) {

            rowsSquares = Array(width).fill().map((_, id) => rowId * width + id)

            if (rowsSquares.every(index => squares[index].classList.contains('freezed'))) {
                if (!isSoundIndicatorDisable()) successSound.play()
                score += width
                scoreDisplay.innerHTML = score

                if(score % levelWeight === 0){
                    level++
                    levelDisplay.innerHTML = levels[level]
                    //if (!isSoundIndicatorDisable()) successSound.play()
                }
                leftPartOfRow = rowsSquares.slice(0, width / 2).reverse()
                rightPartOfRow = rowsSquares.slice(width / 2)
                cleanPath(leftPartOfRow, cleanDelay)
                cleanPath(rightPartOfRow, cleanDelay)

                setTimeout(() => {
                    let squaresRemoved = squares.splice(rowId * width, width)
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(square => mainGrid.appendChild(square))
                    if(level === levels.length) gameOver('glory')
                }, cleanDelay * width / 2)
            }
        }
    }

    function gameOver(reson = 'loss') {
        clearInterval(timerId)
        timerId = null
        clearPreview()
        if (!isSoundIndicatorDisable() && loss) gameoverSound.play()
        animation()
    }

    function generateRange(from, to, step = 1) {
        pathLength = (to - from) / step
        range = Array(pathLength + 1).fill().map((_, idx) => from + step * idx)
        return range
    }

    function drawPath(path, timeInt = 10) {
        let id = 0
        let drawTimer = setInterval(function () {
            if (id == path.length) {
                clearInterval(drawTimer)
                return
            }
            squares[path[id]].classList.add('tetromino')
            id++
        }, timeInt)
    }

    function cleanPath(path, timeInt) {
        let id = 0
        let cleanTimer = setInterval(function () {
            if (id == path.length) {
                clearInterval(cleanTimer)
                return
            }
            squares[path[id]].classList.remove('tetromino')
            squares[path[id]].classList.remove('freezed')
            id++
        }, timeInt)
    }

    function animation(){
        const drawDelay = 10
        drawPath(spiral, drawDelay)
        setTimeout(() => {
            clearGrid()
        }, drawDelay * squares.length + 500)
        setTimeout(() => {
            fillGrid()
        }, drawDelay * squares.length + 1000)
        setTimeout(() => {
            clearGrid()
        }, drawDelay * squares.length + 1500)
        setTimeout(() => {
            fillGrid()
        }, drawDelay * squares.length + 2000)
        setTimeout(() => {
            clearGrid()
        }, drawDelay * squares.length + 2500)
    }

    function getRandom() {
        return Math.floor(Math.random() * tetrominoes.length)
    }

    function disableIndicators() {
        [pauseIndicator, soundIndicator, resetIndicator].forEach(indicator => {
            isDisable = indicator.classList.contains('disable')
            if (!isDisable) {
                indicator.classList.add('disable')
            }
        })
    }
    function isSoundIndicatorDisable() {
        return soundIndicator.classList.contains('disable')
    }
    function init() {
        levelDisplay.innerHTML = levels[level]
        scoreDisplay.innerHTML = score
    }

    init()
})
