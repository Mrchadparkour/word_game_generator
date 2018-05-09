export default function generateCrossword(words) {
  let sorted = words.sort((a,b) => b.length - a.length)
  // sorted.length = 6
  const mLen = sorted[0].length
  const mtrx = Array.from({length: mLen * 2 }, () => Array(mLen * 2).fill(0))
  let cDir = 'h'

  //Will be array of objects to contain name, x, y , and dir
  const plantedWords = []
  const plantWord = (word, y, x, dir, justChecking) => {
    if (justChecking) console.log(mtrx.slice(0).map(arr => arr.slice(0)))
    // console.log(!(mtrx[y-1] === undefined || mtrx[y-1][x] === 0))
    if (
       justChecking &&
       // check for vertically travelling words
       (dir === 'v' && (mtrx[y + word.length - 1] === undefined) &&
       (!(mtrx[y-1] === undefined || mtrx[y-1][x] === 0) ||
       !(mtrx[y+word.length] === undefined || mtrx[y+word.length][x] === 0))) ||
       //check for horizintally travelling words
       (dir === 'h' && (mtrx[y][x + word.length - 1] === undefined) &&
       (!(mtrx[y][x-1] === undefined || mtrx[y][x-1] === 0) ||
       !(mtrx[y][x+word.length] === undefined || mtrx[y][x+word.length] === 0)))
     ) return false

    else if (justChecking) {
      for (let i=0;i<word.length; i++) {
        if(dir === 'v') {
          // console.log(word[i],  mtrx[y+i][x], y, x+i)
          if (mtrx[y+i][x] !== 0 && mtrx[y+i][x] !== word[i]){
             return false
           }
        }
        else {
          // console.log(word[i],  mtrx[y][x+i], y, x+i)
          if (mtrx[y][x+i] !== 0 && mtrx[y][x+i] !== word[i]){
             return false
           }
        }
      }
      return true;
    }
    else if (!justChecking){
      for(let i=0;i<word.length;i++) {
        if (dir === 'v'){
          // console.log(word[i], mtrx[y+i][x])
          mtrx[y+i][x] = word[i]
        }
        else if( dir === 'h'){
          // console.log(word[i],mtrx[y][x+i])
          mtrx[y][x+i] = word[i]
        }
      }
      plantedWords.push({ dir, x, y, name: word })
      return true
    }
  }

  //returns array of arrays where [ w1 point of intersection, w2 point of intersection ]
  //if the first word is vertical the second word will need to start at(y,x): (y of last + lastPt, x of last - nextPt)
  // else will need to start at(y, x): (y of last - nextPt, x of last + nextPt)
  const findCrossPts = (last, next) => {
    const xPts = []
    const checked = ""
    for (let i=0;i<last.length;i++) {
      if (next.indexOf(last[i]) > -1 && checked.indexOf(last[i]) === -1) {
        for (let j=0; j<next.length; j++) {
          if (last[i] === next[j]) xPts.push([i, j])
        }
      }
    }
    return xPts
  }

  //Put largest word in the horizontally in middle of the board
  plantWord(sorted[0], mtrx.length / 2, (mtrx[0].length - mLen) / 2, cDir)

  //Loop through the res of the words in the sorted arra
  for (let s=1; s < sorted.length;s++) {
    cDir = cDir === 'v' ? 'h' : 'v'
    let last = plantedWords[(cDir === 'v') ? 0 : plantedWords.length - 1]
    let xPts = findCrossPts(last.name, sorted[s])
    let randStart = Math.floor(Math.random() * xPts.length)
    for (let p=randStart; p<xPts.length + randStart;p++) {
      // console.log(last, xPts)
      let xPt = xPts[p % xPts.length]
      if (cDir === 'v') {
        if (plantWord(sorted[s], last.y - xPt[1], last.x + xPt[0], cDir, true)) {
          plantWord(sorted[s], last.y - xPt[1], last.x + xPt[0], cDir)
          p = xPts.length
          break
        }
      } else {
        if (plantWord(sorted[s], last.y + xPt[0], last.x - xPt[1], cDir, true)){
           plantWord(sorted[s], last.y + xPt[0], last.x - xPt[1], cDir)
           p = xPts.length
           break
        }
      }
    }

  }


  return mtrx
}
