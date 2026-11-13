import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Shield,
  Award,
  Clock,
  Building,
  UserCheck,
  Check,
  User,
  AlertCircle,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { exportSupervisorPDF, exportSupervisorExcel, exportFullTraineePortfolio, exportGermanPortfolio } from '../lib/exports';
import { translations } from '../lib/i18n';

interface TraineePortfolioExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSupervisorId?: string;
}

export const TraineePortfolioExportModal: React.FC<TraineePortfolioExportModalProps> = ({
  isOpen,
  onClose,
  defaultSupervisorId,
}) => {
  const { cases, supervisors, trainingRecords, trainingSessions, skills, stats } = useData();
  const { profile, language } = useAuth();
  const t = translations[language] || translations.en;
  const isRTL = language === 'ar';

  // Selected Supervisor ID. 'all' or a supervisor's ID
  const [selectedSupId, setSelectedSupId] = useState<string>(
    defaultSupervisorId || supervisors[0]?.id || 'all'
  );
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [exportError, setExportError] = useState('');

  if (!isOpen || !profile) return null;

  const isAllSupervisors = selectedSupId === 'all';
  const selectedSupervisor = supervisors.find(s => s.id === selectedSupId) || supervisors[0];

  // Supervisor-specific filtered records (isolated per supervisor as required)
  const targetRecords = isAllSupervisors
    ? trainingRecords
    : trainingRecords.filter(r => r.supervisorId === selectedSupervisor?.id);

  const targetSessions = isAllSupervisors
    ? trainingSessions
    : trainingSessions.filter(s => s.supervisorId === selectedSupervisor?.id);

  const targetCases = isAllSupervisors
    ? cases
    : cases.filter(c => {
        if (c.supervisorId) return c.supervisorId === selectedSupervisor?.id;
        return selectedSupervisor && supervisors[0]?.id === selectedSupervisor?.id;
      });

  const targetSkills = isAllSupervisors
    ? skills
    : skills.filter(s => {
        if (s.supervisorId) return s.supervisorId === selectedSupervisor?.id;
        if (selectedSupervisor && s.supervisors && s.supervisors.includes(selectedSupervisor.fullName)) return true;
        return selectedSupervisor && supervisors[0]?.id === selectedSupervisor?.id;
      });

  // Calculate live metrics for the selected supervisor scope
  const targetOpsCount = targetRecords.filter(r => r.procedureName).length;
  const targetCasesCount = targetCases.length;
  const opHours = targetRecords.reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                  targetSessions.reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);
  const skillsHours = targetSkills.reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0);
  const totalTargetHours = opHours + skillsHours;

  const verifiedTargetHours = targetRecords.filter(r => r.verified).reduce((sum, r) => sum + (Number(r.netTrainingHours) || 0), 0) +
                              targetSkills.filter(s => s.competencyStatus === 'Competency Confirmed' || s.competencyStatus === 'Supervisor Assessed').reduce((sum, s) => sum + (Number(s.totalDocumentedHours) || 0), 0) +
                              targetSessions.filter(s => s.verified).reduce((sum, s) => sum + (Number(s.netTrainingHours) || 0), 0);

  const handleExportPDF = () => {
    setExportingFormat('pdf');
    setExportError('');
    try {
      if (isAllSupervisors || !selectedSupervisor) {
        exportFullTraineePortfolio(
          profile,
          cases,
          supervisors,
          trainingRecords,
          trainingSessions,
          skills,
          'pdf'
        );
      } else {
        exportSupervisorPDF({
          trainee: profile,
          supervisor: selectedSupervisor,
          cases: targetCases,
          records: targetRecords,
          sessions: targetSessions,
          skills: targetSkills,
        });
      }
    } catch (err: any) {
      setExportError(`Export error: ${err.message}`);
    } finally {
      setTimeout(() => setExportingFormat(null), 1000);
    }
  };

  const handleExportExcel = () => {
    setExportingFormat('xlsx');
    setExportError('');
    try {
      if (isAllSupervisors || !selectedSupervisor) {
        exportFullTraineePortfolio(
          profile,
          cases,
          supervisors,
          trainingRecords,
          trainingSessions,
          skills,
          'xlsx'
        );
      } else {
        exportSupervisorExcel({
          trainee: profile,
          supervisor: selectedSupervisor,
          cases: targetCases,
          records: targetRecords,
          sessions: targetSessions,
          skills: targetSkills,
        });
      }
    } catch (err: any) {
      setExportError(`Export error: ${err.message}`);
    } finally {
      setTimeout(() => setExportingFormat(null), 1000);
    }
  };

  const handleExportWBO = (format: 'pdf' | 'xlsx') => {
    setExportingFormat(`wbo_${format}`);
    setExportError('');
    try {
      const activeSup = selectedSupervisor || supervisors[0];
      if (!activeSup) {
        setExportError(isRTL ? 'يرجى تسجيل مشرف جراحي واحد على الأقل أولاً.' : 'Please register at least one surgical supervisor first.');
        return;
      }
      exportGermanPortfolio(
        {
          trainee: profile,
          supervisor: activeSup,
          records: targetRecords,
          sessions: targetSessions,
          skills: targetSkills,
        },
        format
      );
    } catch (err: any) {
      setExportError(`WBO Export error: ${err.message}`);
    } finally {
      setTimeout(() => setExportingFormat(null), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="bg-[#101C32] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-bold">
              <Download size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isRTL ? 'تصدير بورتفوليو وسجل المتدرب الطبي' : 'Export Official Surgical Portfolio'}
              </h2>
              <p className="text-xs text-slate-300">
                {profile.fullName} • {profile.medicalQualification} • {profile.specialty}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* 1. Supervisor Selector Window (Core Requirement 6 & User Request) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={14} className="text-teal-600" />
              {isRTL ? 'اختر المشرف المسؤول لتصدير ملفه المعتمد:' : 'Select Supervising Surgeon for Portfolio Export:'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {supervisors.length} {isRTL ? 'مشرفين متاحين' : 'Supervisors'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {supervisors.map(sup => {
              const isSelected = selectedSupId === sup.id;
              const supOps = trainingRecords.filter(r => r.supervisorId === sup.id).length;
              const supHrs = trainingRecords.filter(r => r.supervisorId === sup.id).reduce((s, r) => s + (Number(r.netTrainingHours) || 0), 0) +
                             skills.filter(s => s.supervisorId === sup.id).reduce((s, k) => s + (Number(k.totalDocumentedHours) || 0), 0);
              return (
                <button
                  key={sup.id}
                  type="button"
                  onClick={() => setSelectedSupId(sup.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sup.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate block">
                        {sup.academicDegree || ''} {sup.fullName}
                      </span>
                      {isSelected && <Check size={14} className="text-teal-600 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-teal-800 font-semibold block truncate">
                      {sup.professionalPosition} • {sup.specialty}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {supOps} Ops • {supHrs.toFixed(1)}h Logged
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Option to export all supervisors cumulatively */}
            <button
              type="button"
              onClick={() => setSelectedSupId('all')}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition cursor-pointer ${
                isAllSupervisors
                  ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                isAllSupervisors ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                ALL
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {isRTL ? 'كافة المشرفين (ملف شامل كامل)' : 'All Supervisors (Full Cumulative)'}
                  </span>
                  {isAllSupervisors && <Check size={14} className="text-teal-600 shrink-0" />}
                </div>
                <span className="text-[10px] text-teal-800 font-semibold block truncate">
                  {isRTL ? 'تصدير شامل لكافة المشرفين' : 'Unified multi-supervisor logbook'}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {trainingRecords.length} Total Ops • {stats.totalHours}h
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Live Metrics Banner (Filtered to Selected Supervisor) */}
        <div className="bg-white border-b border-slate-100 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.totalCases}</span>
            <span className="text-sm font-bold text-slate-900">{targetCasesCount} {isRTL ? 'حالة' : 'Cases'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.totalProcedures}</span>
            <span className="text-sm font-bold text-slate-900">{targetOpsCount} {isRTL ? 'عملية' : 'Ops'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.totalHours}</span>
            <span className="text-sm font-bold text-teal-700">{totalTargetHours.toFixed(1)}h {isRTL ? 'ساعة' : 'Hrs'}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">{t.verifiedHours}</span>
            <span className="text-sm font-bold text-emerald-700">{verifiedTargetHours.toFixed(1)}h {isRTL ? 'معتمدة' : 'Verified'}</span>
          </div>
        </div>

        {/* Institutional Signatures & Certification Card Preview (Attachment IMG_20261107_001759.png) */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield size={14} className="text-teal-600" />
              {isRTL ? 'معاينة نموذج الاعتماد المؤسسي والتوقيعات الرسمية' : 'Official Institutional Certification & Signatures'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Certified Layout v2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Trainee Declaration */}
            <div className="bg-white rounded-2xl border-2 border-teal-500/30 overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#101C32] text-white px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    <User size={12} />
                  </div>
                  <h4 className="font-bold text-xs">1. Trainee Declaration</h4>
                </div>
                <div className="p-3 text-[11px] text-slate-700 italic leading-relaxed">
                  "I hereby certify that the clinical cases, surgical operations, surgical skills, and training hours documented herein represent an accurate record of my surgical training."
                </div>
              </div>
              <div className="p-3 pt-0 border-t border-teal-500/20 text-[11px] space-y-2 mt-2">
                <div>
                  <strong className="text-slate-900">Trainee Signature:</strong>
                  <span className="inline-block border-b border-slate-400 w-24 ms-1"></span>
                </div>
                <div>
                  <strong className="text-slate-900">Date of Exposure:</strong>
                  <span className="font-mono text-slate-500 ms-1">___ / ___ / ______</span>
                </div>
              </div>
            </div>

            {/* 2. Supervisor Certification */}
            <div className="bg-white rounded-2xl border-2 border-teal-500/30 overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#101C32] text-white px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    <CheckCircle2 size={12} />
                  </div>
                  <h4 className="font-bold text-xs">2. Supervisor Certification</h4>
                </div>
                <div className="p-3 text-[11px] text-slate-700 italic leading-relaxed">
                  "I hereby confirm that the training activities, clinical cases, surgical skills, and documented training hours recorded in this portfolio accurately reflect the trainee's supervision."
                </div>
              </div>
              <div className="p-3 pt-0 border-t border-teal-500/20 text-[10px] space-y-1 mt-2">
                <p className="font-semibold text-slate-800">
                  Supervisor: {selectedSupervisor?.academicDegree || 'MD, PhD, FEBVS'}
                </p>
                <p className="font-bold text-xs text-slate-900">
                  {selectedSupervisor?.academicTitle || 'Prof. Dr. med.'} {selectedSupervisor?.fullName || 'Thomas Weber'}
                </p>
                <p className="text-slate-500 truncate">{selectedSupervisor?.department || 'Department of Vascular Surgery'}</p>
                <p className="text-slate-500 truncate">{selectedSupervisor?.hospital || 'University Hospital'}</p>
                <p className="text-teal-700 font-mono text-[9px] truncate">Email: {selectedSupervisor?.email || 't.weber@uke-hamburg.de'}</p>
                <div className="pt-1 flex items-center justify-between text-[10px]">
                  <span>Date: _________</span>
                  <span>Supervisor Sig: ____________</span>
                </div>
              </div>
            </div>

            {/* 3. Official Department / Institutional Certification */}
            <div className="bg-white rounded-2xl border-2 border-teal-500/30 overflow-hidden shadow-2xs flex flex-col justify-between">
              <div>
                <div className="bg-[#101C32] text-white px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white">
                    <Building size={12} />
                  </div>
                  <h4 className="font-bold text-xs">3. Department Certification</h4>
                </div>
                <div className="p-3 text-[11px] text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900">{selectedSupervisor?.department || 'Department of Vascular and Endovascular Surgery'}</p>
                  <p className="text-slate-600">{selectedSupervisor?.hospital || 'University Hospital Hamburg-Eppendorf, Germany'}</p>
                </div>
              </div>
              <div className="p-3 pt-0 border-t border-teal-500/20 mt-1">
                <span className="font-bold text-[11px] text-slate-900 block mb-1">Departmental Seal:</span>
                <div className="border-2 border-slate-300 border-dashed rounded-xl h-16 flex items-center justify-center text-[10px] text-slate-400 bg-slate-50">
                  [ Official Institutional Seal & Stamp ]
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-center gap-3 text-teal-700 text-xs font-semibold">
            <span className="h-px bg-teal-500 flex-1"></span>
            <span className="italic">{isRTL ? 'الاعتماد والتوقيعات الرسمية المعتمدة' : 'Official signatures and institutional certification'}</span>
            <span className="h-px bg-teal-500 flex-1"></span>
          </div>
        </div>

        {/* 3. Export Formats Selection */}
        <div className="p-6 space-y-4 text-xs bg-[#FBFDFE]">
          {exportError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between gap-2 font-semibold">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>{exportError}</span>
              </div>
              <button
                type="button"
                onClick={() => setExportError('')}
                className="p-1 rounded-lg hover:bg-red-100 text-red-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">
              {isRTL ? 'صيغة تصدير ملف المشرف المحدد:' : 'Export Format for Selected Scope:'}
            </h3>
            {!isAllSupervisors && selectedSupervisor && (
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 truncate max-w-[240px]">
                {selectedSupervisor.fullName}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format 1: Full Cumulative PDF */}
            <div className="bg-white rounded-2xl border-2 border-teal-500/30 p-4 shadow-xs hover:border-teal-500 transition flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                    {isRTL ? 'الأكثر طلباً' : 'Comprehensive PDF'}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {isRTL ? 'الملف التدريبي الكامل (PDF)' : 'Full Surgical Portfolio (PDF)'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {isRTL
                    ? 'تقرير رسمي معتمد يتضمن كافة الحالات السريرية، العمليات الجراحية، المهارات التقنية، مع إقرار وتوقيع المتدرب وختم وتوقيع المشرف.'
                    : 'Complete official logbook with clinical cases, surgical operations, surgical skills, and verification sign-offs.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={exportingFormat === 'pdf'}
                className="w-full bg-[#0D9488] hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={15} />
                <span>{exportingFormat === 'pdf' ? (isRTL ? 'جارٍ التحميل...' : 'Downloading...') : (isRTL ? 'تحميل ملف PDF جاهز للطباعة' : 'Download Complete PDF')}</span>
              </button>
            </div>

            {/* Format 2: Full Excel Spreadsheet */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-4 shadow-xs hover:border-emerald-500 transition flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <FileSpreadsheet size={18} />
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Multi-Sheet XLSX
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {isRTL ? 'سجل إكسل الشامل (Excel)' : 'Multi-Tab Excel Logbook (.xlsx)'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {isRTL
                    ? 'جداول إكسل منفصلة للحالات السريرية، العمليات، ومصفوفة المهارات للمشرف المختار للتقديم للأقسام والمجالس الطبية.'
                    : 'Structured multi-sheet workbook with separate tabs for Cases, Operations, and Skills Matrix.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportExcel}
                disabled={exportingFormat === 'xlsx'}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={15} />
                <span>{exportingFormat === 'xlsx' ? (isRTL ? 'جارٍ التحميل...' : 'Downloading...') : (isRTL ? 'تحميل جدول إكسل الشامل (.xlsx)' : 'Download Excel Logbook (.xlsx)')}</span>
              </button>
            </div>
          </div>

          {/* Format 3: German WBO Bundesärztekammer Format */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                Bundesärztekammer Weiterbildungsordnung (WBO)
              </span>
              <h4 className="font-bold text-slate-900 text-xs mt-0.5">
                {isRTL ? 'الملف الطبي الألماني المعتمد (WBO Logbuch)' : 'German WBO Official Surgical Logbook'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {isRTL
                  ? 'مصاغ بالمصطلحات القانونية الألمانية الرسمية للاعتراف والتعديل المهني في ألمانيا.'
                  : 'Pre-formatted in official German surgical terminology for approbation and Facharzt recognition.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleExportWBO('pdf')}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <FileText size={13} className="text-red-600" /> PDF
              </button>
              <button
                type="button"
                onClick={() => handleExportWBO('xlsx')}
                className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <FileSpreadsheet size={13} className="text-emerald-700" /> Excel
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {isRTL ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
