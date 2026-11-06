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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { ReactElement } from 'react';
import { Close, Content, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { CloseIcon } from '@/extensions/pj-shared/components/icons';

export interface PhotoZoomProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    src: string;
    name: string;
    caption?: string | null;
}

/** Lupa de la ficha (R4.7): la foto a pantalla completa, ampliada sobre el detalle. Se carga con `React.lazy`. */
export default function PhotoZoom({ open, onOpenChange, src, name, caption }: PhotoZoomProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    return (
        <Root open={open} onOpenChange={onOpenChange}>
            <Portal>
                <Overlay className="fixed inset-0 z-50 bg-pj-ink/90" />
                <Content
                    aria-describedby={undefined}
                    className="fixed inset-0 z-50 flex flex-col bg-pj-ink text-pj-surface outline-none"
                    data-testid="pj-photo-zoom">
                    <div className="flex h-[60px] items-center justify-between pr-3 pl-4">
                        <Title className="font-bold">{t('pdp.zoomTitle', { name })}</Title>
                        <Close
                            aria-label={t('pdp.zoomClose')}
                            className="flex size-[44px] items-center justify-center rounded-full bg-pj-surface/15">
                            <CloseIcon size={20} />
                        </Close>
                    </div>
                    <div className="flex flex-1 items-center overflow-auto">
                        <img
                            src={src}
                            alt={t('pdp.zoomAlt', { name })}
                            className="mx-auto max-h-full w-full max-w-[1200px] origin-[45%_40%] scale-[1.6] object-contain lg:scale-125"
                        />
                    </div>
                    {caption && <p className="p-4 text-sm opacity-85">{caption}</p>}
                </Content>
            </Portal>
        </Root>
    );
}
