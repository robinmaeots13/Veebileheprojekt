//Javascrpti koodi alge sain Githubi repositooriumist crossword, mille tegi kasutaja bladerunr2049 https://github.com/bladerunr2049/crossword. Seda koodi on kohendatud vastavalt küsimustele ning stiili vastavalt leheküljele.
const answers = {
    1: 'N',
    2: 'O',
    3: 'K',
    4: 'K',
    5: 'T',
    6: 'A',
    7: 'I',
    8: 'M',
    9: 'E',
    10: 'N',
    11: 'E',
    12: 'L',
    13: 'I',
    14: 'K',
    15: 'I',
    16: 'L',
    17: 'P',
    18: 'I',
    19: 'K',
    20: 'U',
    21: 'U',
    22: 'L',
    23: 'E',
    24: 'L',
    25: 'O',
    26: 'O',
    27: 'D',
    28: 'U',
    29: 'S',
    30: 'E',
    31: 'S',
    32: 'U',
    33: 'N',
    34: 'D',
    35: 'M',
    36: 'U',
    37: 'N',
    38: 'E',
    39: 'B'
};

const inputs = document.querySelectorAll('input.inpt');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        const id = parseInt(input.parentElement.id);
        const correct = answers[id];

        if(correct) {
            if(input.value.toUpperCase() === correct.toUpperCase()) {
                input.style.color = 'green';
            } else {
                input.style.color = 'red';
            }
        }
    });
});
