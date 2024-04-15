const text_processor = MML.getInstance();

fetch('articles/article.mml')
    .then(_ => _.text())
    .then(_ => text_processor.processText(_))
    .then(_ => fillOutline(_);

