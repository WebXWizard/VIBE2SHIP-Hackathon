import assert from 'node:assert/strict';
import test from 'node:test';

import { getDownloadURL, ref, uploadBytesResumable } from '../src/lib/firebaseMock.ts';

class TestFileReader {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  onloadend: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL(file: Blob) {
    this.result = `data:${file.type};base64,dGVzdC1pbWFnZQ==`;
    queueMicrotask(() => this.onloadend?.({} as ProgressEvent<FileReader>));
  }
}

test('resumable mock upload returns the selected image instead of a stock URL', async () => {
  const originalFileReader = globalThis.FileReader;
  globalThis.FileReader = TestFileReader as unknown as typeof FileReader;

  try {
    const storageRef = ref({}, 'reports/test-image.png');
    const uploadTask = uploadBytesResumable(storageRef, new Blob(['test-image'], { type: 'image/png' }));

    await new Promise<void>((resolve, reject) => {
      uploadTask.on('state_changed', () => undefined, reject, resolve);
    });

    assert.equal(
      await getDownloadURL(uploadTask.snapshot.ref),
      'data:image/png;base64,dGVzdC1pbWFnZQ==',
    );
  } finally {
    globalThis.FileReader = originalFileReader;
  }
});
