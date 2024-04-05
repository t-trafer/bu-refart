import { useCallback, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { CancelToken } from 'axios';

import asyncDebounce from '../utils/asyncDebounce';

type StatusType = 'neutral' | 'changed' | 'saving' | 'success' | 'failure';
interface AutoSaveRef {
  sourceCancel?: () => null;
  timerId?: number;
}
interface UseAutoSaveParams {
  saveCallback: (...args: unknown[]) => unknown;
  debounceDuration: number | undefined;
  statusDuration: number | undefined;
  generateAbortSource: () => {
    source: Promise<void>;
    cancel: () => void;
  };
}
type UseAutoSave = (args: {
  saveCallback: (...args: unknown[]) => unknown;
  debounceDuration: number | undefined;
  statusDuration: number | undefined;
  generateAbortSource: () => {
    source: Promise<void>;
    cancel: () => void;
  };
}) => [
  status: StatusType,
  notifyChange: (...args: unknown[]) => unknown,
  forceSave: () => Promise<unknown>,
];

const useAutoSave: UseAutoSave = ({
  saveCallback,
  debounceDuration,
  statusDuration,
  generateAbortSource,
}) => {
  const ref = useRef<AutoSaveRef>({});
  const [status, setStatus] = useState<StatusType>('neutral');

  const triggerSave = useCallback(
    async (...args) => {
      const source = generateAbortSource();
      ref.current.sourceCancel = source.cancel;
      setStatus(SAVE_STATUS.SAVING);
      try {
        const response = await saveCallback(source.token, ...args);
        setStatus('success');
        return response;
      } catch (err) {
        setStatus('failure');
        return err;
      } finally {
        ref.current.sourceCancel = null;
        ref.current.timerId = setTimeout(setStatus, statusDuration, 'neutral');
      }
    },
    [saveCallback, statusDuration]
  );

  const { method: debouncedTriggerSave, flush: forceSave } = useMemo(
    () => asyncDebounce(triggerSave, debounceDuration),
    [triggerSave, debounceDuration]
  );

  const notifyChange = useCallback(
    (...args) => {
      if (ref.current.timerId) clearTimeout(ref.current.timerId);
      if (ref.current.sourceCancel) ref.current.sourceCancel();
      setStatus('changed');
      return debouncedTriggerSave(...args);
    },
    [debouncedTriggerSave]
  );

  return [status, notifyChange, forceSave];
};

export default useAutoSave;
