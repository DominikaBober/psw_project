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