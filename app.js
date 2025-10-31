document.addEventListener('DOMContentLoaded', () => {

    // screen elements
    const mainGrid = document.querySelector('#main')
    let squares = Array.from(document.querySelectorAll('#main .square'))
    let previewSquares = Array.from(document.querySelectorAll('#preview .square'))
    const style = getComputedStyle(document.body)
    const mainGridWidth = Number(style.getPropertyValue('--main_grid_width'))
    const previewGridWidth = Number(style.getPropertyValue('--preview_grid_width'))
    const levels = Array.from(document.querySelectorAll('.level'))
    const scoreDisplay = document.querySelector('#score')

    // control buttons
    const powerControl = document.querySelector('#powerControl')
    const startPauseControl = document.querySelector('#startPauseControl')
    const soundControl = document.querySelector('#soundControl')
    const resetControl = document.querySelector('#resetControl')

    // move buttons
    const controlMoveLft = document.querySelector('#moveLft')
    const controlMoveRght = document.querySelector('#moveRght')
    const controlMoveDown = document.querySelector('#moveDown')
    const controlRotate = document.querySelector('#rotate')
    const controlSpeed = document.querySelector('#speedUp')

    // indicators 
    const gamePauseIndicator = document.querySelector('#gamePauseIndicator')
    const soundIndicator = document.querySelector('#soundIndicator')
    const resetIndicator = document.querySelector('#resetIndicator')

    // sounds
    const tetrisSound = document.querySelector('#tetrisSound')
    const successSound = document.querySelector('#successSound')
    console.log(tetrisSound)
    const fallSound = document.querySelector('#fallSound')
    const rotationSound = document.querySelector('#rotationSound')
    const gameoverSound = document.querySelector('#gameoverSound')
    const glorySound = document.querySelector('#glorySound')
    tetrisSound.loop = true

    // thanks to layout we have a grid `10 x 20`
    //  0   1   2   3   4   5   6   7   8   9
    // 10  11  12  13  14  15  16  17  18  19
    // ...
    // 190 191 192 193 194 195 196 197 198 199
    // this way we have an access to every element of this grid by index
    // a tetromino (tetromino orientation) is a set of elements defining this shape
    // a tetromino has 4 orientations
    function jTetrominoOrientations(width) {
        return [
            [1, width + 1, 2 * width + 1, 2],
            [width, width + 1, width + 2, 2 * width + 2],
            [1, width + 1, 2 * width + 1, 2 * width],
            [0, width, width + 1, width + 2]
        ]
    }
    function lTetrominoOrientations(width) {
        return [
            [0, 1, width + 1, 2 * width + 1],
            [width, width + 1, width + 2, 2],
            [1, width + 1, 2 * width + 1, 2 * width + 2],
            [width, width + 1, width + 2, 2 * width]
        ]
    }
    function sTetrominoOrientations(width) {
        return [
            [0, width, width + 1, 2 * width + 1],
            [width + 1, width + 2, 2 * width, 2 * width + 1],
            [0, width, width + 1, 2 * width + 1],
            [width + 1, width + 2, 2 * width, 2 * width + 1]
        ]
    }
    function zTetrominoOrientations(width) {
        return [
            [1, width, width + 1, 2 * width],
            [width, width + 1, 2 * width + 1, 2 * width + 2],
            [1, width, width + 1, 2 * width],
            [width, width + 1, 2 * width + 1, 2 * width + 2]
        ]
    }
    function tTetrominoOrientations(width) {
        return [
            [1, width, width + 1, width + 2],
            [1, width + 1, width + 2, 2 * width + 1],
            [width, width + 1, width + 2, 2 * width + 1],
            [1, width, width + 1, 2 * width + 1]
        ]
    }
    function oTetrominoOrientations(width) {
        return [
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1],
            [0, 1, width, width + 1]
        ]
    }
    function iTetrominoOrientations(width) {
        return [
            [1, width + 1, 2 * width + 1, 3 * width + 1],
            [width, width + 1, width + 2, width + 3],
            [1, width + 1, 2 * width + 1, 3 * width + 1],
            [width, width + 1, width + 2, width + 3]
        ]
    }

    const tetrominoes = [
        lTetrominoOrientations(mainGridWidth),
        jTetrominoOrientations(mainGridWidth),
        zTetrominoOrientations(mainGridWidth),
        sTetrominoOrientations(mainGridWidth),
        tTetrominoOrientations(mainGridWidth),
        oTetrominoOrientations(mainGridWidth),
        iTetrominoOrientations(mainGridWidth)
    ]
    const tetrominoesPreview = [
        lTetrominoOrientations(previewGridWidth)[0],
        jTetrominoOrientations(previewGridWidth)[0],
        zTetrominoOrientations(previewGridWidth)[0],
        sTetrominoOrientations(previewGridWidth)[0],
        tTetrominoOrientations(previewGridWidth)[0],
        oTetrominoOrientations(previewGridWidth)[0],
        iTetrominoOrientations(previewGridWidth)[0]
    ]

    let gameInterval = null
    const initOrientation = 0
    const initPosition = 4
    const initScore = 0
    const initLevel = 0
    const initSpeedLevel = 0
    const levelWeight = 5 * mainGridWidth
    let random
    let nextRandom
    let orientation
    let position
    let tetrominoOrientation
    let tetrominoPreviewOrientation
    let score
    let level
    let speedLevel
    let changeFlag

    // events handlers
    powerControl.addEventListener('click', () => { powerControlClickHandler() })
    startPauseControl.addEventListener('click', () => { startPauseControlClickHandler () })
    soundControl.addEventListener('click', () => { soundControlClickHandler() })
    resetControl.addEventListener('click', () => { resetControlClickHandler() })
    controlMoveLft.addEventListener('click', () => { moveLeft() })
    controlMoveRght.addEventListener('click', () => { moveRight() })
    controlMoveDown.addEventListener('click', () => { moveToBottom() })
    controlRotate.addEventListener('click', () => { rotate() })
    controlSpeed.addEventListener('click', () => { speedUp() })
    document.addEventListener('keyup', keyControl)

    function setInitState() {
        clearGameInterval()
        orientation = initOrientation
        position = initPosition
        score = initScore
        level = initLevel
        speedLevel = initSpeedLevel
        changeFlag = Boolean(false)
        random = getRandomTetromino()
        tetrominoOrientation = tetrominoes[random][orientation]
        nextRandom = getRandomTetromino()
        tetrominoPreviewOrientation = tetrominoesPreview[nextRandom]
        clearPreviewGrid()
        clearMainGrid()
        clearLevels()
        clearIndicators()
        scoreDisplay.innerHTML = initScore
    }

    function powerControlClickHandler() {
        if (IsTetrisOn()) {
            powerControl.classList.remove('powerOn')
            powerControl.classList.add('powerOff')
        } else {
            powerControl.classList.remove('powerOff')
            powerControl.classList.add('powerOn')
        }
        setInitState()
    }

    function startPauseControlClickHandler() {
        if (!IsTetrisOn()) return

        if (gameInterval) {
            clearGameInterval()
            gamePauseIndicator.classList.remove('disabled')
            gamePauseIndicator.classList.add('enabled')
            if (!isSoundIndicatorDisable()) {
                tetrisSound.pause()
            }
        } else {
            gamePauseIndicator.classList.remove('enabled')
            gamePauseIndicator.classList.add('disabled')
            scoreDisplay.classList.remove('disabled')
            scoreDisplay.classList.add('enabled')
            updatePreview()
            setGameInterval()
        }
    }
    function setGameInterval() {
        if (!gameInterval) {
            gameInterval = setInterval(moveDown, 850 / (speedLevel + 1))
        }
    }
    function clearGameInterval() {
        if (gameInterval) {
            clearInterval(gameInterval)
            gameInterval = null
        }
    }
    function soundControlClickHandler() {
        if (!IsTetrisOn()) return

        if (isSoundIndicatorDisable()) {
            tetrisSound.play()
            soundIndicator.classList.remove('disabled')
        } else {
            tetrisSound.pause()
            tetrisSound.currentTime = 0
            soundIndicator.classList.add('disabled')
        }
    }

    function resetControlClickHandler() {
        if (!IsTetrisOn()) return

        setInitState()
        setGameInterval()
        updatePreview()
    }

    function keyControl(button) {
        if (!IsTetrisOn() || !gameInterval) return
        if (button.key === 'ArrowLeft') {
            moveLeft()
        } else if (button.key === 'ArrowRight') {
            moveRight()
        } else if (button.key === 'ArrowDown') {
            moveToBottom()
        } else if (button.key === 'ArrowUp') {
            speedUp()
        } else if (button.key === 'Shift') {
            rotate()
        }
    }

    function draw() {
        if (!IsTetrisOn() || !gameInterval) return

        tetrominoOrientation.forEach(index => {
            squares[position + index].classList.add('tetromino')
        })
    }

    function undraw() {
        if (!IsTetrisOn() || !gameInterval) return

        tetrominoOrientation.forEach(index => {
            squares[position + index].classList.remove('tetromino')
        })
    }

    function moveLeft() {
        if (isFreezedTetromino () || isAtLeft() || isTakenSquareAtLeft()) return
        undraw()
        position--
        draw()
    }

    function moveRight() {
        if (isFreezedTetromino () || isAtRight() || isTakenSquareAtRight()) return
        undraw()
        position++
        draw()
    }

    function moveDown() {
        undraw()
        position += mainGridWidth
        draw()
        if (isAtBottom() || isTouchFreezedSquare()) {
            freezeCurrentTetrimino()
            clearGameInterval()
            updateScore()
            setGameInterval()
            if (level === levels.length) stopGame('glory')
            drawNextTetrimino()
            if (isFreezedTetromino()) stopGame('gameover')
        }
    }

    function moveToBottom() {
        let currentChangeFlag = changeFlag
        while (currentChangeFlag === changeFlag) {
            moveDown()
        }
    }

    function rotate() {
        if (isFreezedTetromino()) return
        undraw()
        orientation++
        newOrientation = orientation % tetrominoes[random].length
        tetrominoOrientation = tetrominoes[random][newOrientation]
        checkRotatedPosition()
        draw()
        if (!isSoundIndicatorDisable()) rotationSound.play()
    }

    function speedUp() {
        if (!IsTetrisOn() || !gameInterval) return

        clearGameInterval()
        speedLevel++
        speedLevel = speedLevel % 3
        clearGameInterval()
        setGameInterval()
    }

    function checkRotatedPosition(P){
        P = P || position
        if ((P+1) % mainGridWidth < 4) {
          if (isAtRight()){
            position++
            checkRotatedPosition(P)
            }
        } else if (P % mainGridWidth > 5) {
          if (isAtLeft()){
            position--
            checkRotatedPosition(P)
          }
        }
      }

    function IsTetrisOn() {
        return powerControl.classList.contains('powerOn')
    }

    function isSoundIndicatorDisable() {
        return soundIndicator.classList.contains('disabled')
    }

    function isAtRight() {
        return tetrominoOrientation.some(index => (position + index + 1) % mainGridWidth == 0)
    }

    function isAtLeft() {
        return tetrominoOrientation.some(index => (position + index) % mainGridWidth == 0)
    }

    function isAtBottom() {
        return tetrominoOrientation.some(index => position + index >= squares.length - mainGridWidth)
    }

    function isTakenSquareAtRight() {
        return tetrominoOrientation.some(index => squares[position + index + 1].classList.contains('freezed'))
    }

    function isTakenSquareAtLeft() {
        return tetrominoOrientation.some(index => squares[position + index - 1].classList.contains('freezed'))
    }

    function isFreezedTetromino() {
        return tetrominoOrientation.some(index => squares[position + index].classList.contains('freezed'))
    }

    function isTouchFreezedSquare() {
        return tetrominoOrientation.some(index => squares[position + index + mainGridWidth].classList.contains('freezed'))
    }

    function freezeCurrentTetrimino() {
        tetrominoOrientation.forEach(index => {
            squares[position + index].classList.add('freezed')
        })
        if (!isSoundIndicatorDisable()) fallSound.play()
    }

    function drawNextTetrimino() {
        changeFlag = !changeFlag
        position = initPosition
        orientation = 0
        random = nextRandom
        tetrominoOrientation = tetrominoes[random][orientation]
        nextRandom = getRandomTetromino()
        updatePreview()
        draw()
    }

    function updatePreview() {
        clearPreviewGrid()
        tetrominoPreviewOrientation = tetrominoesPreview[nextRandom]
        tetrominoPreviewOrientation.forEach(index => {
            previewSquares[index].classList.add('tetromino')
        })
    }

    function clearPreviewGrid() {
        previewSquares.forEach(previewSquare => {
            previewSquare.classList.remove('tetromino')
        })
    }

    function clearMainGrid() {
        squares.forEach(square => {
            square.classList.remove('tetromino', 'freezed')
        })
    }

    function fillMainGrid() {
        squares.forEach(square => {
            square.classList.add('tetromino')
        })
    }

    function clearLevels() {
        levels.forEach(levelElement => {
            levelElement.classList.remove('enabled')
            levelElement.classList.add('disabled')
        })
    }

    function clearIndicators() {
        if (!isSoundIndicatorDisable()) {
            tetrisSound.pause()
            tetrisSound.currentTime = 0
            soundIndicator.classList.remove('enabled')
            soundIndicator.classList.add('disabled')
        }
        gamePauseIndicator.classList.remove('enabled')
        gamePauseIndicator.classList.add('disabled')
        resetIndicator.classList.remove('enabled')
        resetIndicator.classList.add('disabled')
    }

    function updateScore() {
        for (let rowId = 0; rowId < squares.length / mainGridWidth; rowId++) {

            rowsSquares = Array.from({length: mainGridWidth}, (_, id) => rowId * mainGridWidth + id)

            if (rowsSquares.every(index => squares[index].classList.contains('freezed'))) {
                if (!isSoundIndicatorDisable()) successSound.play()
                score += mainGridWidth
                scoreDisplay.innerHTML = score
                if(score % levelWeight === 0){
                    level++
                    levels[level - 1].classList.remove('disabled')
                }
                cleanPath(rowsSquares, 100)
                setTimeout(() => {
                    let squaresRemoved = squares.splice(rowId * mainGridWidth, mainGridWidth)
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(square => mainGrid.appendChild(square))
                }, 100 * mainGridWidth / 2 )
            }
        }
    }

    function stopGame(reason) {
        clearGameInterval()
        clearPreviewGrid()
        if (!isSoundIndicatorDisable()) {
            tetrisSound.pause()
            if (reason === 'gameover') gameoverSound.play()
            if (reason === 'glory') glorySound.play()
        }
        spiralAnimation()
        blinkAnimation()
    }

    function generateRange(from, to, step = 1) {
        pathLength = (to - from) / step
        range = Array(pathLength + 1).fill().map((_, idx) => from + step * idx)
        return range
    }

    function drawPath(path) {
        let id = 0
        let drawTimer = setInterval(function () {
            if (id == path.length) {
                clearInterval(drawTimer)
                return
            }
            squares[path[id]].classList.add('tetromino')
            id++
        }, 10)
    }

    function cleanPath(rowsSquares, cleanDelay) {
        let id = 0
        let cleanTimer = setInterval(function () {
            if (id == mainGridWidth / 2) {
                clearInterval(cleanTimer)
                return
            }
            squares[rowsSquares[5 + id]].classList.remove('tetromino', 'freezed')
            squares[rowsSquares[5 - (id + 1)]].classList.remove('tetromino', 'freezed')
            id++
        }, cleanDelay - 10 )
        // fix for Safari: The main grid update happens erlier than the clearing the last pieces of row #0, #9 
    }
    function spiralAnimation(){
        let spiral = []
        for (let i = 0; i < 5; i++) {
            spiral = spiral.concat(generateRange(11 * i, 9 * (1 + i), 1))
            spiral = spiral.concat(generateRange(10 + 9 * (1 + i), 199 - 11 * i, 10))
            spiral = spiral.concat(generateRange(198 - 11 * i, 190 - 9 * i, -1))
            spiral = spiral.concat(generateRange(180 - 9 * i, 10 + 11 * i, -10))
        }
        drawPath(spiral)
    }

    function blinkAnimation(){
        setTimeout(() => { clearMainGrid() }, 500)
        setTimeout(() => { fillMainGrid() }, 1000)
        setTimeout(() => { clearMainGrid() }, 1500)
        setTimeout(() => { fillMainGrid() }, 2000)
        setTimeout(() => { clearMainGrid() }, 2500)
    }

    function getRandomTetromino() {
        return Math.floor(Math.random() * tetrominoes.length)
    }

    setInitState()

})
