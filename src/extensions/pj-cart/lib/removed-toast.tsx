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
import { toast } from 'sonner';
import { PJ_TOAST_CLASS } from '@/extensions/pj-shared/lib/added-toast';
import { RemovedToast, type RemovedToastProps } from '../components/removed-toast';

/** Muestra el aviso 5 s (sin `Link`: el Toaster vive fuera de los providers del sitio). */
export function showRemovedToast(props: Omit<RemovedToastProps, 'onDismiss'>): void {
    toast.custom((id) => <RemovedToast {...props} onDismiss={() => toast.dismiss(id)} />, {
        duration: 5000,
        className: PJ_TOAST_CLASS,
    });
}
