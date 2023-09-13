import { iteracer } from '../index';
import readline from 'readline';
import { PassThrough } from 'stream';


// Create a readable stream to provide custom input
const input = new PassThrough();
input.write('Line 1\n');
input.write('Line 2\n');
input.end();

const rl = readline.createInterface({
  // input: process.stdin,
  input,
  output: process.stdout,
});

// Function to create an async iterator that reads lines of text from user input
async function* createLineReader(): AsyncGenerator<string, void, void> {
  for await (const line of rl) {
    yield line;
  }
}

// Function to create an async iterator that yields an incrementing number every second
async function* createTimeoutLoop(): AsyncGenerator<number, void, void> {
  let count = 0;
  while (true) {
    yield count++;
    if (count === 4) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
  }
}

async function* createTimeoutLoop2(): AsyncGenerator<number, void, void> {
  let count = 0;
  while (true) {
    yield count++;
    if (count === 3) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
  }
}

// Example callback functions
function callbackForIterator1(value: number | string) {
  console.log(`Callback for Iterator 1: ${value}`);
  return true;
}

function callbackForIterator2(value: number | string) {
  console.log(`Callback for Iterator 2: ${value}`);
  return true;
}

let doneForIterator1Called = false;
function doneForIterator1() {
  doneForIterator1Called = true;
  console.log('Done for Iterator 1');
}

let doneForIterator2Called = false;
function doneForIterator2() {
  doneForIterator2Called = true;
  console.log('Done for Iterator 2');
}

const lineReader = createLineReader();


describe('iteracer', () => {
  it('should doneForIterator1Called', async () => {
    doneForIterator1Called = false;
    doneForIterator2Called = false;

    await iteracer(
      lineReader,
      createTimeoutLoop(),
      callbackForIterator1,
      callbackForIterator2,
      doneForIterator1,
      doneForIterator2
    );
    expect(doneForIterator1Called).toBe(true);
  });
  it('should doneForIterator2Called', async () => {
    doneForIterator1Called = false;
    doneForIterator2Called = false;

    await iteracer(
      createTimeoutLoop2(),
      createTimeoutLoop(),
      callbackForIterator1,
      callbackForIterator2,
      doneForIterator1,
      doneForIterator2
    );
    expect(doneForIterator2Called).toBe(true);
  });
});

afterAll(() => {
  rl.close();
});