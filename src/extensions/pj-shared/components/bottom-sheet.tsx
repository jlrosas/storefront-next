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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import type { ReactElement, ReactNode } from 'react';
import { Close, Content, Description, Overlay, Portal, Root, Title } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CloseIcon } from './icons';

export interface BottomSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Título visible (Barlow Condensed en mayúsculas). Siempre requerido por accesibilidad. */
    title: ReactNode;
    /** Bajada opcional bajo el título. */
    description?: ReactNode;
    /** Contenido desplazable. */
    children: ReactNode;
    /** Pie fijo (botón «Agregar · $X»). */
    footer?: ReactNode;
    /** Oculta el título a la vista (sigue para lectores de pantalla). */
    hideTitle?: boolean;
    className?: string;
}

/**
 * Hoja del lienzo (Sheet-Pizza.dc.html): sube desde abajo en móvil y es un panel lateral a la
 * derecha desde `lg`. Atrapa el foco, cierra con Escape y con el botón de 44 px.
 * Por la regla de overlays del template, quien la usa la carga con `React.lazy` y la monta
 * después de la primera interacción.
 */
export function BottomSheet({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    hideTitle = false,
    className,
}: BottomSheetProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    return (
        <Root open={open} onOpenChange={onOpenChange}>
            <Portal>
                <Overlay className="fixed inset-0 z-50 bg-pj-ink/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Content
                    data-testid="pj-bottom-sheet"
                    className={cn(
                        'fixed z-50 flex flex-col bg-pj-cream text-pj-ink shadow-pj-float outline-none',
                        'inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[20px] pb-[env(safe-area-inset-bottom)]',
                        'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom',
                        'lg:inset-y-0 lg:right-0 lg:left-auto lg:max-h-none lg:w-[480px] lg:rounded-none lg:rounded-l-[20px]',
                        'lg:data-[state=open]:slide-in-from-right lg:data-[state=closed]:slide-out-to-right',
                        className
                    )}
                    {...(description ? {} : { 'aria-describedby': undefined })}>
                    <div
                        aria-hidden="true"
                        className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-pj-line lg:hidden"
                    />
                    <div className="flex items-start gap-3 px-4 pt-3 pb-2 lg:px-6 lg:pt-6">
                        <div className={cn('min-w-0 flex-1', hideTitle && 'sr-only')}>
                            <Title className="font-heading text-2xl font-extrabold uppercase leading-none">
                                {title}
                            </Title>
                            {description && (
                                <Description className="mt-1 text-[15px] text-pj-gray">{description}</Description>
                            )}
                        </div>
                        <Close
                            aria-label={t('sheet.close')}
                            className="ml-auto flex size-11 shrink-0 items-center justify-center rounded-full bg-pj-surface text-pj-ink shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                            <CloseIcon size={20} />
                        </Close>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 lg:px-6">{children}</div>
                    {footer && (
                        <div className="border-t border-pj-line bg-pj-surface px-4 py-3 lg:px-6 lg:py-4">{footer}</div>
                    )}
                </Content>
            </Portal>
        </Root>
    );
}

export default BottomSheet;
