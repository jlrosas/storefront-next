/**
 * Copyright 2026 Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/extensions/pj-shared/hooks/use-reduced-motion';

/**
 * Un número que «cuenta» hacia su valor nuevo (UX-3 §3.10: precio de la línea, total y saldo de puntos).
 * Con «reducir movimiento» cambia de inmediato. El primer valor se pinta tal cual (sin animar al cargar).
 */
export function useCountUp(value: number, duration = 220): number {
    const reduced = useReducedMotion();
    const [shown, setShown] = useState(value);
    const from = useRef(value);
    useEffect(() => {
        if (reduced || from.current === value || typeof window === 'undefined') {
            from.current = value;
            setShown(value);
            return undefined;
        }
        const start = performance.now();
        const origin = from.current;
        let frame = 0;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - t) ** 3;
            setShown(Math.round(origin + (value - origin) * eased));
            if (t < 1) frame = requestAnimationFrame(tick);
            else from.current = value;
        };
        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            from.current = value;
        };
    }, [value, duration, reduced]);
    return shown;
}
