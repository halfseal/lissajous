export class OBJ {
    lines;

    pos = [];
    norm = [];
    tc = [];
    indices = [];

    readFile(path) {
        let reader = new XMLHttpRequest();
        reader.open("GET", path);
        reader.onreadystatechange = () => {
            if (reader.readyState === 4) {
                if (reader.status === 200 || reader.status === 0) {
                    console.log("Successfully loaded " + reader.responseURL)
                    this.lines = (reader.responseText).split('\n');
                    this.handleObj();
                } else {
                    alert("Failed loading " + reader.responseURL);
                }
            }
        }
        reader.send(null);
    }

    handleObj() {
        // console.log(this.lines.length);
        for (let i = 0; i < 10; i++) {
            let line = this.lines[i];
            let items = line.replace(/\s\s+/g, ' ').trim().split(' ');

            switch (items[0].toLowerCase()) {
                case "#" :
                    continue;

                case "o" :
                    break;

                case "v" :
                    break;

                case "vt" :
                    break;

                case "vn" :
                    break;

                case "f" :
                    break;

                case "mtllib" :
                    // console.table(items);
                    break;


            }
        }
    }
}