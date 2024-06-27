fetch('text.txt')
    .then(_ => _.text())
    .then(_ => processText(_))
    .then(_ => document.body.innerHTML = _);

    