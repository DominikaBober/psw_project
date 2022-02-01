export const check_results = (game, all_games) => {

    return Object.keys(all_games).map(key => all_games[key])
        .filter(
            some_game => some_game.top_text.length === some_game.top_text.filter(
                (el, i) => game.top_text[i] === 0 ? true : game.top_text[i] === el).length
        ).filter(
            some_game => some_game.bottom_text.length === some_game.bottom_text.filter(
                (el, i) => game.bottom_text[i] === 0 ? true : game.bottom_text[i] === el).length
        ).filter(
            some_game => some_game.left_text.length === some_game.left_text.filter(
                (el, i) => game.left_text[i] === 0 ? true : game.left_text[i] === el).length
        ).filter(
            some_game => some_game.right_text.length === some_game.right_text.filter(
                (el, i) => game.right_text[i] === 0 ? true : game.right_text[i] === el).length
        )
}

export const create_game = (game, difficulty) => {

    const difficulty_levels = [0.1, 0.35, 0.6, 0.8, 1]

    const bars = {top_text: game.top_text, left_text: game.left_text,
                                bottom_text: game.bottom_text, right_text: game.right_text}

    const number_of_texts = Math.ceil(difficulty_levels[difficulty-1]*game.top_text.length*4-1)

    for (let i=0; i<number_of_texts; i++){
        let temp_index = Math.floor(Math.random()*game.top_text.length)
        let temp_row = Object.keys(bars)[Math.floor(Math.random()*Object.keys(bars).length)]
        bars[temp_row][temp_index] = 0
    }

    return bars
}